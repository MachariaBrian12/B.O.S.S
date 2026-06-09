import { PrismaClient } from '@prisma/client';

/**
 * Prisma Singleton
 *
 * Analogy: one permanent receptionist for the whole building.
 * Without this, every module that imports Prisma spins up its
 * own connection pool — like hiring a new receptionist every
 * time someone walks through the door, then firing them when
 * they leave. That exhausts your DB connections fast.
 *
 * The global check prevents hot-reload in dev from creating
 * a new client on every file change.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
