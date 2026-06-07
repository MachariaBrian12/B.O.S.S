import bcrypt from 'bcryptjs';
import { signToken } from '../shared/jwt';
import { AppError } from '../shared/app.error';
import { UserRepository } from './auth.repository';

/**
 * REGISTER USER
 */
export async function register(email: string, password: string, name?: string) {
  const existing = await UserRepository.findByEmail(email);

  if (existing) {
    throw new AppError('User already exists', 409);
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await UserRepository.create({
    email,
    password: hashed,
    name,
    role: 'user',
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

/**
 * LOGIN USER
 */
export async function login(email: string, password: string) {
  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
}
