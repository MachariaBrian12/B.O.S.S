import 'dotenv/config';

/**
 * =========================
 * ENVIRONMENT CONFIG (CLEAN & SAFE)
 * =========================
 */

function required(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;

  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  /**
   * SERVER
   */
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  /**
   * AUTH
   */
  JWT_SECRET: required('JWT_SECRET', 'dev_secret_change_me'),

  /**
   * AI
   */
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

  /**
   * MPESA (OPTIONAL — SAFE TO RUN WITHOUT)
   */
  MPESA_ENV: process.env.MPESA_ENV || 'sandbox',
  MPESA_CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY || '',
  MPESA_CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET || '',
  MPESA_SHORTCODE: process.env.MPESA_SHORTCODE || '',
  MPESA_PASSKEY: process.env.MPESA_PASSKEY || '',
  MPESA_CALLBACK_URL: process.env.MPESA_CALLBACK_URL || '',
};
