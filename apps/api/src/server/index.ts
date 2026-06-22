import '../lib/sentry'; // MUST be first — initialises Sentry before anything else
import * as Sentry from '@sentry/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import aiRoutes from '../routes/ai.route';
import adminRoutes from '../routes/admin.route';
import authRoutes from '../routes/auth.routes';
import businessRoutes from '../routes/business.routes';
import insightsRoutes from '../routes/insights.routes';

dotenv.config();

const { init } = require('../db/database');

const app = express();

// Required for accurate req.ip behind Railway / Vercel reverse proxies.
// Without this, all IPs appear as the proxy's IP instead of the client's.
app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─── Rate limiting ────────────────────────────────────────────────────────────

// Strict limiter for auth endpoints — prevents brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
});

// General limiter for all other API routes
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // max 100 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({ status: 'B.O.S.S API RUNNING', time: new Date().toISOString() });
});

// Apply strict rate limiting to auth routes first
app.use('/api/v1/auth', authLimiter, authRoutes);

// General rate limit on everything else
app.use('/api/v1/ai', apiLimiter, aiRoutes);
app.use('/api/v1/admin', apiLimiter, adminRoutes);
app.use('/api/v1/business', apiLimiter, businessRoutes);
app.use('/api/v1/insights', apiLimiter, insightsRoutes);

// ─── Error handler ───────────────────────────────────────────────────────────

app.use((err: any, _req: any, res: any, _next: any) => {
  Sentry.captureException(err);
  console.error('SERVER ERROR:', err);

  // Never leak internal error details to the client in production
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';

  res.status(500).json({ success: false, message });
});

// ─── Start ───────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4000;

const start = async () => {
  await init();
  app.listen(PORT, () => {
    console.log('\n==================================');
    console.log('B.O.S.S SERVER RUNNING');
    console.log(`http://localhost:${PORT}`);
    console.log('AI ROUTE:    /api/v1/ai/chat');
    console.log('ADMIN ROUTE: /api/v1/admin/stats');
    console.log('==================================\n');
  });
};

start().catch((err) => {
  console.error('FATAL: Failed to start server:', err);
  process.exit(1);
});
