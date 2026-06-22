import { Request, Response, NextFunction } from 'express';

export declare const JWT_SECRET: string;
export declare function protect(
  req: Request,
  res: Response,
  next: NextFunction,
): void;
