import express from 'express';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const router = express.Router();
const prisma = new PrismaClient();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', async (req, res) => {
  try {
    const { userId, messages } = req.body;

    if (!userId || !messages) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Save user messages
    for (const msg of messages) {
      await prisma.message.create({
        data: {
          userId,
          role: msg.role,
          content: msg.content,
        },
      });
    }

    // AI call
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    const reply = response.choices[0].message.content;

    // Save AI response
    await prisma.message.create({
      data: {
        userId,
        role: 'assistant',
        content: reply,
      },
    });

    res.json({ success: true, data: { reply } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI failed' });
  }
});

export default router;
