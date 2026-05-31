import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import aiRoutes from '../routes/ai.route';
import adminRoutes from '../routes/admin.route';

// Load environment variables
dotenv.config();

/**
 * =========================
 * APP INITIALIZATION
 * =========================
 */
const app = express();

/**
 * =========================
 * MIDDLEWARE
 * =========================
 */
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

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get('/', (req, res) => {
  res.json({
    status: 'B.O.S.S API RUNNING',
    time: new Date().toISOString(),
  });
});

/**
 * =========================
 * ROUTES
 * =========================
 */

// AI ROUTES
app.use('/api/v1/ai', aiRoutes);

// ADMIN ROUTES
app.use('/api/v1/admin', adminRoutes);

/**
 * =========================
 * ERROR HANDLING
 * =========================
 */
app.use((err: any, req: any, res: any, next: any) => {
  console.error('🔥 SERVER ERROR:', err);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

/**
 * =========================
 * START SERVER
 * =========================
 */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('\n==================================');
  console.log('🚀 B.O.S.S SERVER RUNNING');
  console.log(`📡 http://localhost:${PORT}`);
  console.log('🧠 AI ROUTE: /api/v1/ai/chat');
  console.log('📊 ADMIN ROUTE: /api/v1/admin/stats');
  console.log('==================================\n');
});
