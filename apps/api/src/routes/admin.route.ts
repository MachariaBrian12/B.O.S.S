import express from 'express';
import { pool } from '../db/database';

const router = express.Router();

router.get('/stats', async (req, res) => {
  const secret = req.headers['x-admin-secret'];
  if (secret !== process.env.BOSS_ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { rows: users } = await pool.query(
      'SELECT id, name, email, business, created_at FROM users ORDER BY created_at DESC'
    );
    const now = new Date();
    const todayStart = new Date(now.setHours(0,0,0,0));
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);

    const newToday = users.filter(u => new Date(u.created_at) >= todayStart).length;
    const newThisWeek = users.filter(u => new Date(u.created_at) >= weekStart).length;

    res.json({
      totalOrgs: users.length,
      totalUsers: users.length,
      activeSubscriptions: 0,
      freeOrgs: users.length,
      paidOrgs: 0,
      aiActions: 0,
      newOrgsToday: newToday,
      newOrgsThisWeek: newThisWeek,
      conversionRate: "0",
      recentUsers: users.map(u => ({
        id: String(u.id),
        name: u.name,
        email: u.email,
        role: "user",
        createdAt: u.created_at,
        organization: { name: u.business }
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
