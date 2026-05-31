import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';

import { config } from '../config/env';
import { logger } from '../modules/shared/logger';
import { apiLimiter } from '../modules/shared/rate.limit';
import { errorHandler } from '../modules/shared/error.handler';

import authRoutes from '../modules/auth/auth.routes';
import aiRoutes from '../modules/ai/ai.routes';

import { authMiddleware } from '../modules/shared/auth.middleware';
import { roleGuard } from '../modules/shared/role.guard';

const app = express();

/**
 * SECURITY
 */
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: '*',
  }),
);

app.use(express.json());

/**
 * RATE LIMITING
 */
app.use(apiLimiter);

/**
 * LOGGING
 */
app.use(
  pinoHttp({
    logger,
  }),
);

/**
 * HEALTH CHECK
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'OK',
  });
});

/**
 * AUTH ROUTES
 */
app.use('/api/v1/auth', authRoutes);

/**
 * AI ROUTES (CORE PRODUCT LAYER)
 */
app.use('/api/v1/ai', aiRoutes);

/**
 * PROTECTED TEST ROUTES
 */
app.get('/api/v1/me', authMiddleware, (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

/**
 * ADMIN ONLY ROUTE
 */
app.get('/api/v1/admin', authMiddleware, roleGuard('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome Admin',
  });
});

/**
 * ERROR HANDLER (LAST MIDDLEWARE)
 */
app.use(errorHandler);

/**
 * START SERVER
 */
const server = app.listen(config.port, () => {
  logger.info(`🚀 B.O.S.S backend running on port ${config.port}`);
});

/**
 * GRACEFUL SHUTDOWN
 */
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down...');
  server.close(() => {
    logger.info('Server stopped');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down...');
  server.close(() => {
    logger.info('Server stopped');
  });
});
