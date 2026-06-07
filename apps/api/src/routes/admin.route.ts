import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      users,
      messages,
    });
  } catch (err) {
    res.status(500).json({ error: 'failed to load admin stats' });
  }
});

export default router;
