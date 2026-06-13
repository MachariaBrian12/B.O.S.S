import { NextRequest } from 'next/server';
import { Pool } from 'pg';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (!secret || secret !== process.env.BOSS_ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action  = searchParams.get('action') || '';
  const limit   = parseInt(searchParams.get('limit') || '100');
  const actorId = searchParams.get('actorId') || '';

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

    const conditions: string[] = [];
    const values: any[]        = [];
    let   idx = 1;

    if (action)  { conditions.push(`a.action = $${idx++}`);    values.push(action); }
    if (actorId) { conditions.push(`a."actorId" = $${idx++}`); values.push(actorId); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await pool.query(
      `SELECT a.id, a."actorId", a.action, a."resourceType", a."resourceId",
              a.metadata, a.ip, a."userAgent", a."createdAt",
              u.name AS "actorName", u.email AS "actorEmail"
       FROM "AuditLog" a
       LEFT JOIN "User" u ON u.id = a."actorId"
       ${where}
       ORDER BY a."createdAt" DESC
       LIMIT $${idx}`,
      [...values, limit]
    );

    await pool.end();
    return new Response(JSON.stringify({ logs: rows }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
