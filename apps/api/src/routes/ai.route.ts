import express from 'express';
import OpenAI from 'openai';
import * as Sentry from '@sentry/node';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * Singleton OpenAI client.
 *
 * Analogy: one skilled barista on shift all day vs hiring
 * a new barista for every single coffee order. Same output,
 * drastically less overhead. Creating a new OpenAI client
 * per request re-initialises the HTTP connection pool every
 * time — wasteful and slow.
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * GPT-4o-mini pricing (USD per token).
 * Update these when OpenAI changes pricing.
 */
const PRICING = {
  'gpt-4o-mini': {
    prompt:     0.00000015,  // $0.15 per 1M tokens
    completion: 0.00000060,  // $0.60 per 1M tokens
  },
} as const;

function calcCost(model: string, promptTokens: number, completionTokens: number): number {
  const p = PRICING[model as keyof typeof PRICING] ?? PRICING['gpt-4o-mini'];
  return promptTokens * p.prompt + completionTokens * p.completion;
}

/**
 * POST /api/v1/ai/chat
 *
 * Protected — requires Bearer token.
 * Tracks: latency, token usage, cost per request, success/failure.
 *
 * Analogy: every taxi trip now has a meter (cost), a GPS log
 * (Sentry span), and a receipt (AiUsage row). You'll know
 * exactly how much each user and each feature costs you.
 */
router.post('/chat', authMiddleware, async (req: any, res) => {
  const { messages, feature = 'chat' } = req.body;
  const userId = req.user?.id;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, message: 'messages array required' });
  }

  const aiStart = Date.now();
  let success = true;

  return await Sentry.startSpan(
    { name: 'ai.chat', op: 'ai.completion', attributes: { userId, feature } },
    async (span) => {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
        });

        const latencyMs        = Date.now() - aiStart;
        const usage            = completion.usage;
        const promptTokens     = usage?.prompt_tokens     ?? 0;
        const completionTokens = usage?.completion_tokens ?? 0;
        const totalTokens      = promptTokens + completionTokens;
        const costUsd          = calcCost('gpt-4o-mini', promptTokens, completionTokens);
        const reply            = completion.choices?.[0]?.message?.content ?? '';

        span?.setAttribute('ai.latency_ms',         latencyMs);
        span?.setAttribute('ai.prompt_tokens',      promptTokens);
        span?.setAttribute('ai.completion_tokens',  completionTokens);
        span?.setAttribute('ai.cost_usd',           costUsd);
        span?.setAttribute('ai.feature',            feature);

        /**
         * Fire-and-forget cost log — never blocks the response.
         * Like a taxi meter that prints the receipt in the background
         * while the passenger is already walking away.
         */
        if (userId) {
          prisma.aiUsage.create({
            data: {
              id: crypto.randomUUID(),
              userId,
              feature,
              model:            'gpt-4o-mini',
              promptTokens,
              completionTokens,
              totalTokens,
              costUsd,
              latencyMs,
              success: true,
            },
          }).catch((err: Error) =>
            console.error('[AiUsage] Failed to log usage:', err.message)
          );
        }

        return res.json({
          success: true,
          data: {
            reply,
            usage: { promptTokens, completionTokens, totalTokens, costUsd, latencyMs },
          },
        });

      } catch (err: any) {
        success = false;
        const latencyMs = Date.now() - aiStart;

        Sentry.captureException(err);

        if (userId) {
          prisma.aiUsage.create({
            data: {
              id: crypto.randomUUID(),
              userId,
              feature,
              model:            'gpt-4o-mini',
              promptTokens:     0,
              completionTokens: 0,
              totalTokens:      0,
              costUsd:          0,
              latencyMs,
              success:          false,
            },
          }).catch(() => {});
        }

        return res.status(500).json({ success: false, message: err?.message ?? 'AI request failed' });
      }
    }
  );
});

export default router;
