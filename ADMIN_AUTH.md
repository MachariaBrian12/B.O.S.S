# B.O.S.S Admin Auth (Single Source of Truth)

## Secret:
BOSS_ADMIN_SECRET=boss_admin_2026_live_key

## Flow:
Frontend → sends x-admin-secret  
Backend → validates against BOSS_ADMIN_SECRET  
If match → allow admin access
