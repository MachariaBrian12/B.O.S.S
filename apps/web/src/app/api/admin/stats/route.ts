import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const ADMIN_SECRET = process.env.BOSS_ADMIN_SECRET;

export async function GET(req: NextRequest) {
  // Secret is checked server-side only — never sent to the browser
  if (!ADMIN_SECRET) {
    return NextResponse.json(
      { error: 'Admin not configured' },
      { status: 503 },
    );
  }

  // The admin page sends x-internal-token which is verified here on the server.
  // The real BOSS_ADMIN_SECRET is never exposed to the browser.
  const internalToken = req.headers.get('x-internal-token');
  if (!internalToken || internalToken !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const [usersResult, countResult, todayResult, weekResult] =
      await Promise.all([
        pool.query(
          'SELECT id, name, email, business, created_at FROM users ORDER BY created_at DESC LIMIT 20',
        ),
        pool.query('SELECT COUNT(*) FROM users'),
        pool.query(
          'SELECT COUNT(*) FROM users WHERE created_at::date = CURRENT_DATE',
        ),
        pool.query(
          "SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days'",
        ),
      ]);

    const totalUsers = parseInt(countResult.rows[0].count);
    const newToday = parseInt(todayResult.rows[0].count);
    const newThisWeek = parseInt(weekResult.rows[0].count);

    const recentUsers = usersResult.rows.map((u: any) => ({
      id: u.id.toString(),
      name: u.name,
      email: u.email,
      role: 'user',
      createdAt: u.created_at,
      organization: { name: u.business || '—' },
    }));

    return NextResponse.json({
      totalOrgs: totalUsers,
      totalUsers: totalUsers,
      activeSubscriptions: 0,
      freeOrgs: totalUsers,
      paidOrgs: 0,
      aiActions: 0,
      newOrgsToday: newToday,
      newOrgsThisWeek: newThisWeek,
      conversionRate: '0',
      recentUsers,
    });
  } catch (err: any) {
    // Never leak internal error details to the client
    console.error('Admin stats error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 },
    );
  } finally {
    // Always close the pool — whether the query succeeded or failed
    await pool.end();
  }
}
