export async function GET(req: Request) {
  const secret = req.headers.get("x-admin-secret");

  if (!secret || secret !== process.env.BOSS_ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  return new Response(JSON.stringify({
    status: "ok",
    revenue: 5400,
    users: 124,
    ai_actions: 320
  }), { status: 200 });
}
