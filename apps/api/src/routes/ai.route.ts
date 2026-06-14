import express from 'express';
import OpenAI from 'openai';
import * as Sentry from '@sentry/node';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Inline auth — removes broken middleware import dependency
function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev_secret_change_me',
    );
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PRICING = {
  'gpt-4o-mini': {
    prompt: 0.00000015,
    completion: 0.0000006,
  },
} as const;

function calcCost(
  model: string,
  promptTokens: number,
  completionTokens: number,
): number {
  const p = PRICING[model as keyof typeof PRICING] ?? PRICING['gpt-4o-mini'];
  return promptTokens * p.prompt + completionTokens * p.completion;
}

router.post('/chat', authMiddleware, async (req: any, res) => {
  const { messages, feature = 'chat' } = req.body;
  const userId = req.user?.id;

  if (!messages || !Array.isArray(messages)) {
    return res
      .status(400)
      .json({ success: false, message: 'messages array required' });
  }

  const aiStart = Date.now();

  return await Sentry.startSpan(
    { name: 'ai.chat', op: 'ai.completion', attributes: { userId, feature } },
    async (span) => {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
        });

        const latencyMs = Date.now() - aiStart;
        const usage = completion.usage;
        const promptTokens = usage?.prompt_tokens ?? 0;
        const completionTokens = usage?.completion_tokens ?? 0;
        const totalTokens = promptTokens + completionTokens;
        const costUsd = calcCost('gpt-4o-mini', promptTokens, completionTokens);
        const reply = completion.choices?.[0]?.message?.content ?? '';

        span?.setAttribute('ai.latency_ms', latencyMs);
        span?.setAttribute('ai.prompt_tokens', promptTokens);
        span?.setAttribute('ai.completion_tokens', completionTokens);
        span?.setAttribute('ai.cost_usd', costUsd);
        span?.setAttribute('ai.feature', feature);

        if (userId) {
          prisma.aiUsage
            .create({
              data: {
                id: crypto.randomUUID(),
                userId,
                feature,
                model: 'gpt-4o-mini',
                promptTokens,
                completionTokens,
                totalTokens,
                costUsd,
                latencyMs,
                success: true,
              },
            })
            .catch((err: Error) =>
              console.error('[AiUsage] Failed to log usage:', err.message),
            );
        }

        return res.json({
          success: true,
          data: {
            reply,
            usage: {
              promptTokens,
              completionTokens,
              totalTokens,
              costUsd,
              latencyMs,
            },
          },
        });
      } catch (err: any) {
        const latencyMs = Date.now() - aiStart;
        Sentry.captureException(err);

        if (userId) {
          prisma.aiUsage
            .create({
              data: {
                id: crypto.randomUUID(),
                userId,
                feature,
                model: 'gpt-4o-mini',
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
                costUsd: 0,
                latencyMs,
                success: false,
              },
            })
            .catch(() => {});
        }

        return res
          .status(500)
          .json({
            success: false,
            message: err?.message ?? 'AI request failed',
          });
      }
    },
  );
});

export default router;
