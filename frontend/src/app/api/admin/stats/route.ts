export async function GET(req: Request) {
  const auth = req.headers.get("x-admin-secret");

  if (!auth || auth !== process.env.BOSS_ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // MOCK DATA (replace later with DB)
  return new Response(JSON.stringify({
    totalUsers: 124,
    revenue: 5400,
    activeOrgs: 18,
    aiActions: 320
  }), {
    status: 200,
  });
}
