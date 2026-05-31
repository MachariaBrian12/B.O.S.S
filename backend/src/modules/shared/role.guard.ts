import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

/**
 * ROLE BASED ACCESS CONTROL
 */
export function roleGuard(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient permissions',
      });
    }

    next();
  };
}
