import rateLimit from 'express-rate-limit';

/**
 * GLOBAL API RATE LIMIT
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Try again later.',
    error: 'RATE_LIMIT_EXCEEDED',
  },
});
