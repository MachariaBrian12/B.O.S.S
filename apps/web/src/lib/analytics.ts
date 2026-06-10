import posthog from "posthog-js";

/**
 * B.O.S.S Analytics — typed event tracking.
 *
 * Analogy: instead of every developer shouting random things
 * into a walkie-talkie, this is a standardised radio protocol.
 * Everyone uses the same event names, the same property keys.
 * That's what makes PostHog dashboards actually useful — when
 * "entry_created" always means the same thing everywhere.
 *
 * Usage:
 *   import { analytics } from "@/lib/analytics";
 *   analytics.entryCreated({ sales: 5000, expenses: 2000 });
 */
export const analytics = {
  // Auth events
  login: (props: { method?: string } = {}) =>
    posthog.capture("login", props),

  logout: () =>
    posthog.capture("logout"),

  register: (props: { business?: string } = {}) =>
    posthog.capture("register", props),

  // Business entry events
  entryCreated: (props: { sales: number; expenses: number }) =>
    posthog.capture("entry_created", {
      ...props,
      profit: props.sales - props.expenses,
    }),

  entryUpdated: (props: { sales: number; expenses: number }) =>
    posthog.capture("entry_updated", {
      ...props,
      profit: props.sales - props.expenses,
    }),

  entryDeleted: () =>
    posthog.capture("entry_deleted"),

  // AI events
  aiMessageSent: (props: { feature?: string } = {}) =>
    posthog.capture("ai_message_sent", props),

  aiResponseReceived: (props: { latencyMs?: number; success?: boolean } = {}) =>
    posthog.capture("ai_response_received", props),

  // Navigation / feature usage
  pageViewed: (page: string) =>
    posthog.capture("page_viewed", { page }),

  featureUsed: (feature: string, props: Record<string, unknown> = {}) =>
    posthog.capture("feature_used", { feature, ...props }),
};
