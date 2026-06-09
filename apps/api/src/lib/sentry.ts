import * as Sentry from '@sentry/node';
import { expressIntegration } from '@sentry/node';

/**
 * Sentry for the Express API — v10 style.
 *
 * In v8+, Express instrumentation moved into an integration
 * rather than middleware. Think of it like upgrading from
 * a security guard who stands at every door individually
 * to a building-wide access control system — same coverage,
 * zero per-door setup.
 *
 * prismaIntegration() automatically traces every DB query
 * so you can see in Sentry exactly which queries are slow.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
  integrations: [
    expressIntegration(),
    Sentry.prismaIntegration(),
  ],
});

export { Sentry };
