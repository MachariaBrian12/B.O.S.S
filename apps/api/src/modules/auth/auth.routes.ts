import { Router } from 'express';
import { registerController, loginController } from './auth.controller';
import { validate } from '../shared/validate';
import { registerSchema, loginSchema } from './auth.validation';

const router = Router();

/**
 * AUTH ROUTES (WITH VALIDATION)
 */
router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);

export default router;
