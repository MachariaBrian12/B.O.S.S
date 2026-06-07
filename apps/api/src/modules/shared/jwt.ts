import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

/**
 * =========================
 * JWT SIGN
 * =========================
 */
export function signToken(payload: object) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

/**
 * =========================
 * JWT VERIFY
 * =========================
 */
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
