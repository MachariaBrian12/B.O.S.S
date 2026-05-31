import { Request, Response, NextFunction } from 'express';
import { AppError } from './app.error';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error('🔥 ERROR:', err);

  const statusCode = err.statusCode || 500;

  const isOperational = err instanceof AppError;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: isOperational ? 'OPERATIONAL_ERROR' : 'SYSTEM_ERROR',
    data: null,
  });
}
