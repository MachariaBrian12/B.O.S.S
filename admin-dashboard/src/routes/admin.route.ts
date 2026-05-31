import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/stats', async (req, res) => {
  try {
    const usersCount = await prisma.user.count();
    const messagesCount = await prisma.message.count();

    const recentMessages = await prisma.message.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: {
        usersCount,
        messagesCount,
        recentMessages,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'admin failed' });
  }
});

export default router;
