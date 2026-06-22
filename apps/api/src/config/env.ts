import 'dotenv/config';

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
}

function optional(key: string, fallback = ''): string {
  return process.env[key] || fallback;
}

export const env = {
  // Server
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  NODE_ENV: optional('NODE_ENV', 'development'),

  // Auth — no fallback, crashes at startup if missing
  JWT_SECRET: required('JWT_SECRET'),

  // AI
  OPENAI_API_KEY: optional('OPENAI_API_KEY'),

  // M-Pesa — all optional, service checks them at call time
  MPESA_ENV: optional('MPESA_ENV', 'sandbox'),
  MPESA_CONSUMER_KEY: optional('MPESA_CONSUMER_KEY'),
  MPESA_CONSUMER_SECRET: optional('MPESA_CONSUMER_SECRET'),
  MPESA_SHORTCODE: optional('MPESA_SHORTCODE'),
  MPESA_PASSKEY: optional('MPESA_PASSKEY'),
  MPESA_CALLBACK_URL: optional('MPESA_CALLBACK_URL'),
};
