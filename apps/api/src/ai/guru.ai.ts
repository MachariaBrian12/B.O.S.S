import OpenAI from 'openai';
import * as Sentry from '@sentry/node';
import { prisma } from '../lib/prisma';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

/**
 * GURU AI MEMORY ENGINE
 *
 * Performance fixes:
 * 1. Removed upsert on every call — user must exist before
 *    calling guruAI (handled at registration). Doing a DB
 *    write before every AI message was like checking your
 *    passport at the door of every room in a hotel instead
 *    of just once at check-in.
 *
 * 2. Save message + load history run in parallel.
 *
 * 3. Sentry spans wrap each stage so you can see exactly
 *    which step is slow in the Sentry Performance dashboard.
 */
export async function guruAI(
  messages: ChatMessage[],
  context: { userId: string },
) {
  const { userId } = context;
  const lastMessage = messages[messages.length - 1];

  return await Sentry.startSpan(
    { name: 'guruAI', op: 'ai.chat' },
    async (span) => {

      // STEP 1: Save user message + load history in parallel
      const [, history] = await Sentry.startSpan(
        { name: 'db.loadHistory', op: 'db.query' },
        async () =>
          Promise.all([
            prisma.message.create({
              data: {
                role: lastMessage.role,
                content: lastMessage.content,
                userId,
              },
            }),
            prisma.message.findMany({
              where: { userId },
              orderBy: { createdAt: 'asc' },
              take: 20,
            }),
          ]),
      );

      span?.setAttribute('history.count', history.length);

      // STEP 2: AI completion — almost always the slowest step
      const aiStart = Date.now();
      const response = await Sentry.startSpan(
        { name: 'openai.chat.completions', op: 'ai.completion' },
        async () =>
          client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'You are Guru AI inside the B.O.S.S platform. You are futuristic, intelligent, concise, and highly capable.',
              },
              ...history.map((m) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content,
              })),
            ],
          }),
      );

      const latencyMs = Date.now() - aiStart;
      const usage = response.usage;
      span?.setAttribute('ai.latency_ms', latencyMs);
      span?.setAttribute('ai.prompt_tokens', usage?.prompt_tokens ?? 0);
      span?.setAttribute('ai.completion_tokens', usage?.completion_tokens ?? 0);
      span?.setAttribute('ai.model', 'gpt-4o-mini');

      const reply =
        response.choices[0]?.message?.content ||
        'I could not generate a response.';

      // STEP 3: Save AI reply
      await Sentry.startSpan(
        { name: 'db.saveReply', op: 'db.query' },
        async () =>
          prisma.message.create({
            data: { role: 'assistant', content: reply, userId },
          }),
      );

      return {
        reply,
        memory: true,
        historyCount: history.length,
        latencyMs,
        tokens: {
          prompt: usage?.prompt_tokens ?? 0,
          completion: usage?.completion_tokens ?? 0,
        },
      };
    },
  );
}
