import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');

  if (!secret || secret !== process.env.BOSS_ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    const usersResult = await pool.query(
      'SELECT id, name, email, business, created_at FROM users ORDER BY created_at DESC LIMIT 20',
    );
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const todayResult = await pool.query(
      'SELECT COUNT(*) FROM users WHERE created_at::date = CURRENT_DATE',
    );
    const weekResult = await pool.query(
      "SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days'",
    );

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

    await pool.end();

    return new Response(
      JSON.stringify({
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
      }),
      { status: 200 },
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
