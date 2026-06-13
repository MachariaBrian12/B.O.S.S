import { NextRequest } from 'next/server';
import { Pool } from 'pg';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (!secret || secret !== process.env.BOSS_ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

    const { rows: summary } = await pool.query(`
      SELECT COUNT(*) AS "totalRequests", SUM("totalTokens") AS "totalTokens",
             SUM("costUsd") AS "totalCostUsd", AVG("latencyMs") AS "avgLatencyMs",
             SUM(CASE WHEN success THEN 1 ELSE 0 END) AS "successCount"
      FROM "AiUsage"
    `);

    const { rows: perUser } = await pool.query(`
      SELECT a."userId", u.name, u.email,
             COUNT(*) AS requests, SUM("totalTokens") AS tokens,
             SUM("costUsd") AS cost, AVG("latencyMs") AS "avgLatency"
      FROM "AiUsage" a
      LEFT JOIN "User" u ON u.id = a."userId"
      GROUP BY a."userId", u.name, u.email
      ORDER BY cost DESC LIMIT 20
    `);

    const { rows: perFeature } = await pool.query(`
      SELECT feature, COUNT(*) AS requests,
             SUM("totalTokens") AS tokens, SUM("costUsd") AS cost
      FROM "AiUsage"
      GROUP BY feature ORDER BY cost DESC
    `);

    await pool.end();
    return new Response(JSON.stringify({ summary: summary[0], perUser, perFeature }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
