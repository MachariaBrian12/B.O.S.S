import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../shared/jwt';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { organization: true },
  });

  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) throw new Error('Invalid credentials');

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    },
    token,
  };
}
