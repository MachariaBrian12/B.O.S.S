import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

/**
 * =========================
 * SAFE CLIENT FACTORY
 * =========================
 */
function createClient() {
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    throw new Error('OPENAI_API_KEY is missing in .env');
  }

  return new OpenAI({
    apiKey: key,
  });
}

/**
 * =========================
 * AI CHAT ROUTE
 * =========================
 */
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: 'messages array required',
      });
    }

    const client = createClient();

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    const reply = completion.choices?.[0]?.message?.content;

    return res.json({
      success: true,
      data: { reply },
    });
  } catch (err: any) {
    console.error('AI ERROR:', err?.message);

    return res.status(500).json({
      success: false,
      message: err?.message || 'AI request failed',
    });
  }
});

export default router;
