#!/bin/bash

echo "🔧 Fixing B.O.S.S Admin Auth System..."

# -----------------------------
# 1. CREATE SINGLE SOURCE OF TRUTH
# -----------------------------
echo "🧠 Setting admin secret..."

ADMIN_SECRET="boss_admin_2026_live_key"

# backend env files
echo "BOSS_ADMIN_SECRET=$ADMIN_SECRET" >> backend/.env
echo "BOSS_ADMIN_SECRET=$ADMIN_SECRET" >> backend/.env.production

# frontend env (optional safety if needed)
echo "NEXT_PUBLIC_ADMIN_SECRET=$ADMIN_SECRET" >> frontend/.env.local

# -----------------------------
# 2. FIX BACKEND API AUTH ROUTE
# -----------------------------
echo "🛠 Fixing admin API route..."

mkdir -p frontend/src/app/api/admin

cat > frontend/src/app/api/admin/stats/route.ts << 'JS'
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
JS

# -----------------------------
# 3. FIX FRONTEND FETCH FUNCTION
# -----------------------------
echo "🎯 Fixing frontend admin page..."

cat > frontend/src/app/admin/fetchAdmin.ts << 'JS'
export async function fetchStats(secret: string) {
  const res = await fetch("/api/admin/stats", {
    method: "GET",
    headers: {
      "x-admin-secret": secret,
    },
  });

  if (!res.ok) {
    throw new Error("Invalid admin secret");
  }

  return res.json();
}
JS

# -----------------------------
# 4. CLEAN LOGICAL REMINDER FILE
# -----------------------------
echo "📌 Writing config reminder..."

cat > ADMIN_AUTH.md << 'MD'
# B.O.S.S Admin Auth (Single Source of Truth)

## Secret:
BOSS_ADMIN_SECRET=boss_admin_2026_live_key

## Flow:
Frontend → sends x-admin-secret  
Backend → validates against BOSS_ADMIN_SECRET  
If match → allow admin access
MD

# -----------------------------
# DONE
# -----------------------------
echo "✅ Admin auth fixed successfully"
echo "👉 Next: restart dev server + redeploy on Vercel"
