import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_SECRET = process.env.ADMIN_SECRET || "boss-admin-2026";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalOrgs,
    totalUsers,
    activeSubscriptions,
    freeOrgs,
    paidOrgs,
    recentUsers,
    aiActions,
    newOrgsToday,
    newOrgsThisWeek,
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "active" } }),
    prisma.subscription.count({ where: { plan: "free" } }),
    prisma.subscription.count({ where: { plan: { not: "free" } } }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { organization: true },
    }),
    prisma.aIAction.count(),
    prisma.organization.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } },
    }),
    prisma.organization.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  return NextResponse.json({
    totalOrgs,
    totalUsers,
    activeSubscriptions,
    freeOrgs,
    paidOrgs,
    recentUsers,
    aiActions,
    newOrgsToday,
    newOrgsThisWeek,
    conversionRate: totalOrgs > 0 ? ((paidOrgs / totalOrgs) * 100).toFixed(1) : "0",
  });
}
