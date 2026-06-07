import { Request, Response } from 'express';
import { register, login } from './auth.service';

export async function registerController(req: Request, res: Response) {
  const result = await register(
    req.body.email,
    req.body.password,
    req.body.name,
  );

  res.json({
    success: true,
    message: 'User registered',
    data: result,
  });
}

export async function loginController(req: Request, res: Response) {
  const result = await login(req.body.email, req.body.password);

  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
}
