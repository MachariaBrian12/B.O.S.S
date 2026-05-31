import { Router } from 'express';
import { authMiddleware } from '../shared/auth.middleware';
import { runAI } from './ai.service';

const router = Router();

router.post('/run', authMiddleware, async (req: any, res) => {
  const { prompt } = req.body;

  const result = await runAI(prompt, {
    user: req.user,
    organizationId: req.organizationId,
  });

  res.json({
    success: true,
    data: result,
  });
});

export default router;
