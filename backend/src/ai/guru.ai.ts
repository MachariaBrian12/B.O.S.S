import OpenAI from 'openai';
import { prisma } from '../lib/prisma';
import 'dotenv/config';

/**
 * =========================
 * OPENAI CLIENT
 * =========================
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * =========================
 * CHAT MESSAGE TYPE
 * =========================
 */
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

/**
 * =========================
 * GURU AI MEMORY ENGINE
 * =========================
 */
export async function guruAI(
  messages: ChatMessage[],
  context: { userId: string },
) {
  const { userId } = context;

  /**
   * GET LAST USER MESSAGE
   */
  const lastMessage = messages[messages.length - 1];

  /**
   * ENSURE USER EXISTS
   */
  await prisma.user.upsert({
    where: {
      email: `${userId}@boss.ai`,
    },

    update: {},

    create: {
      email: `${userId}@boss.ai`,
      password: 'ai-managed-user',
      name: userId,
      role: 'user',
    },
  });
  /**
   * SAVE USER MESSAGE
   */
  await prisma.message.create({
    data: {
      role: lastMessage.role,
      content: lastMessage.content,
      userId,
    },
  });

  /**
   * LOAD PREVIOUS MEMORY
   */
  const history = await prisma.message.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 20,
  });

  /**
   * AI COMPLETION
   */
  const response = await client.chat.completions.create({
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
  });

  /**
   * AI RESPONSE
   */
  const reply =
    response.choices[0]?.message?.content || 'I could not generate a response.';

  /**
   * SAVE AI RESPONSE
   */
  await prisma.message.create({
    data: {
      role: 'assistant',
      content: reply,
      userId,
    },
  });

  /**
   * RETURN RESPONSE
   */
  return {
    reply,
    memory: true,
    historyCount: history.length,
  };
}
