import { prisma } from '../../lib/prisma';

export const UserRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  create(data: {
    email: string;
    password: string;
    name?: string;
    role?: string;
  }) {
    return prisma.user.create({
      data,
    });
  },
};
