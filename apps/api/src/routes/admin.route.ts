import express from 'express';
import { pool } from '../db/database';

const router = express.Router();

// Crash at startup if the admin secret is not configured.
// This is intentional — a missing secret means the admin route is
// wide open, which is worse than the server not starting at all.
const ADMIN_SECRET = process.env.BOSS_ADMIN_SECRET;
if (!ADMIN_SECRET) {
  console.error(
    'FATAL: BOSS_ADMIN_SECRET environment variable is not set. Refusing to start.',
  );
  process.exit(1);
}

const requireAdminSecret = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const secret = req.headers['x-admin-secret'];

  // Reject if missing, empty, or doesn't match — all three cases explicitly
  if (!secret || !ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

router.get('/stats', requireAdminSecret, async (req, res) => {
  try {
    const { rows: users } = await (pool as any).query(
      'SELECT id, name, email, business, created_at FROM users ORDER BY created_at DESC',
    );

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const newToday = users.filter(
      (u: any) => new Date(u.created_at) >= todayStart,
    ).length;
    const newThisWeek = users.filter(
      (u: any) => new Date(u.created_at) >= weekStart,
    ).length;

    res.json({
      totalOrgs: users.length,
      totalUsers: users.length,
      activeSubscriptions: 0,
      freeOrgs: users.length,
      paidOrgs: 0,
      aiActions: 0,
      newOrgsToday: newToday,
      newOrgsThisWeek: newThisWeek,
      conversionRate: '0',
      recentUsers: users.map((u: any) => ({
        id: String(u.id),
        name: u.name,
        email: u.email,
        role: 'user',
        createdAt: u.created_at,
        organization: { name: u.business },
      })),
    });
  } catch (err: any) {
    // Don't leak internal error details to the client
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
