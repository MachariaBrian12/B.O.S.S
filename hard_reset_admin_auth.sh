#!/bin/bash

echo "🔥 Hard resetting B.O.S.S admin auth..."

# 1. REMOVE ALL OLD/CONFLICTING AUTH FILES
rm -f frontend/src/app/admin/fetchAdmin.ts

# 2. FORCE SINGLE API ROUTE
mkdir -p frontend/src/app/api/admin

cat > frontend/src/app/api/admin/stats/route.ts << 'JS'
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
JS

# 3. FORCE FRONTEND CLEAN CALL
cat > frontend/src/app/admin/adminClient.ts << 'JS'
export async function fetchAdminStats(secret: string) {
  const res = await fetch("/api/admin/stats", {
    method: "GET",
    headers: {
      "x-admin-secret": secret
    }
  });

  if (!res.ok) throw new Error("Invalid admin secret");
  return res.json();
}
JS

# 4. ENSURE ENV CONSISTENCY
echo "BOSS_ADMIN_SECRET=boss_admin_2026_live_key" >> backend/.env
echo "BOSS_ADMIN_SECRET=boss_admin_2026_live_key" >> backend/.env.production

echo "NEXT_PUBLIC_ADMIN_SECRET=boss_admin_2026_live_key" >> frontend/.env.local

echo "✅ Admin system HARD RESET complete"
