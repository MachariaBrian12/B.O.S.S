import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import aiRoutes from '../routes/ai.route';
import adminRoutes from '../routes/admin.route';

dotenv.config();

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
app.use(morgan('dev'));

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get('/', (req, res) => {
  res.json({ status: 'B.O.S.S API RUNNING' });
});

/**
 * =========================
 * ROUTES
 * =========================
 */
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/admin', adminRoutes);

/**
 * =========================
 * START SERVER
 * =========================
 */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('🚀 B.O.S.S SERVER RUNNING');
  console.log(`📡 http://localhost:${PORT}`);
});
