import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './jwt';

export interface AuthRequest extends Request {
  user?: any;
  organizationId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded: any = verifyToken(token);

    req.user = decoded;

    // CRITICAL: org context is now part of request
    req.organizationId = decoded.organizationId;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
