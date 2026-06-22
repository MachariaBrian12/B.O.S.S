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

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // AiUsage table doesn't exist in the live schema yet (Prisma only).
    // Return empty data rather than a 500 until schema is aligned (bug #4).
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'AiUsage'
      ) AS exists
    `);

    if (!tableCheck.rows[0]?.exists) {
      return NextResponse.json({
        summary: {
          totalRequests: '0',
          totalTokens: '0',
          totalCostUsd: '0',
          avgLatencyMs: '0',
          successCount: '0',
        },
        perUser: [],
        perFeature: [],
      });
    }

    const [summaryRes, perUserRes, perFeatureRes] = await Promise.all([
      pool.query(`
        SELECT COUNT(*)                                        AS "totalRequests",
               SUM("totalTokens")                             AS "totalTokens",
               SUM("costUsd")                                 AS "totalCostUsd",
               AVG("latencyMs")                               AS "avgLatencyMs",
               SUM(CASE WHEN success THEN 1 ELSE 0 END)       AS "successCount"
        FROM "AiUsage"
      `),
      pool.query(`
        SELECT a."userId", u.name, u.email,
               COUNT(*)           AS requests,
               SUM("totalTokens") AS tokens,
               SUM("costUsd")     AS cost,
               AVG("latencyMs")   AS "avgLatency"
        FROM "AiUsage" a
        LEFT JOIN "User" u ON u.id = a."userId"
        GROUP BY a."userId", u.name, u.email
        ORDER BY cost DESC
        LIMIT 20
      `),
      pool.query(`
        SELECT feature,
               COUNT(*)           AS requests,
               SUM("totalTokens") AS tokens,
               SUM("costUsd")     AS cost
        FROM "AiUsage"
        GROUP BY feature
        ORDER BY cost DESC
      `),
    ]);

    return NextResponse.json({
      summary: summaryRes.rows[0],
      perUser: perUserRes.rows,
      perFeature: perFeatureRes.rows,
    });
  } catch (err: any) {
    console.error('Admin ai-usage error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch AI usage' },
      { status: 500 },
    );
  } finally {
    await pool.end();
  }
}
