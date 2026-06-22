import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function protect(req: Request, res: Response, next: NextFunction) {
  try {
    const token =
      req.headers.authorization?.replace('Bearer ', '') ||
      (req.cookies as any)?.boss_token;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Alias for backwards compatibility
export const authMiddleware = protect;

export const JWT_SECRET = env.JWT_SECRET;
