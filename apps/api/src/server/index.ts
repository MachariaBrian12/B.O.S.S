import '../lib/sentry'; // MUST be first — initialises Sentry before anything else
import * as Sentry from '@sentry/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import aiRoutes from '../routes/ai.route';
import adminRoutes from '../routes/admin.route';
import authRoutes from '../routes/auth.routes';
import businessRoutes from '../routes/business.routes';
import insightsRoutes from '../routes/insights.routes';

dotenv.config();

const { init } = require('../db/database');

const app = express();

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

app.get('/', (_req, res) => {
  res.json({ status: 'B.O.S.S API RUNNING', time: new Date().toISOString() });
});

// ROUTES
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/business', businessRoutes);
app.use('/api/v1/insights', insightsRoutes);

// In Sentry v8+, Express is instrumented via expressIntegration()
// in sentry.ts — no middleware needed here. Errors are captured
// automatically. Your own error handler stays exactly as it was.
app.use((err: any, _req: any, res: any, _next: any) => {
  Sentry.captureException(err);
  console.error('SERVER ERROR:', err);
  res
    .status(500)
    .json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;

const start = async () => {
  await init();
  app.listen(PORT, () => {
    console.log('\n==================================');
    console.log('B.O.S.S SERVER RUNNING');
    console.log(`http://localhost:${PORT}`);
    console.log('AI ROUTE: /api/v1/ai/chat');
    console.log('ADMIN ROUTE: /api/v1/admin/stats');
    console.log('==================================\n');
  });
};

start();
