import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

try {
  prismaInstance =
    globalForPrisma.prisma || new PrismaClient({ log: ['error', 'warn'] });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
} catch (err) {
  console.warn(
    '[Prisma] Client not initialized — run prisma generate to enable Prisma features.',
  );
  prismaInstance = new Proxy({} as PrismaClient, {
    get: () => () => Promise.resolve(null),
  });
}

export const prisma = prismaInstance;
