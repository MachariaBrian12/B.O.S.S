import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const ADMIN_SECRET = process.env.BOSS_ADMIN_SECRET;

export async function GET(req: NextRequest) {
  if (!ADMIN_SECRET) {
    return NextResponse.json(
      { error: 'Admin not configured' },
      { status: 503 },
    );
  }

  const internalToken = req.headers.get('x-internal-token');
  if (!internalToken || internalToken !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') || '';
  const limitRaw = searchParams.get('limit');
  const limit = limitRaw ? parseInt(limitRaw, 10) : 100;
  const actorId = searchParams.get('actorId') || '';

  // Guard against NaN from invalid limit param (bug #24)
  if (isNaN(limit) || limit < 1 || limit > 1000) {
    return NextResponse.json(
      { error: 'Invalid limit parameter' },
      { status: 400 },
    );
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // AuditLog table doesn't exist in the live schema yet (Prisma only).
    // Return empty logs rather than a 500 until schema is aligned (bug #4).
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'AuditLog'
      ) AS exists
    `);

    if (!tableCheck.rows[0]?.exists) {
      return NextResponse.json({ logs: [] });
    }

    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (action) {
      conditions.push(`a.action = $${idx++}`);
      values.push(action);
    }
    if (actorId) {
      conditions.push(`a."actorId" = $${idx++}`);
      values.push(actorId);
    }

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
      [...values, limit],
    );

    return NextResponse.json({ logs: rows });
  } catch (err: any) {
    console.error('Admin audit-logs error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 },
    );
  } finally {
    await pool.end();
  }
}
