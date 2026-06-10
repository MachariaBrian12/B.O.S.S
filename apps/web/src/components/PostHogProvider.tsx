"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useBusinessStore } from "@/store/useBusinessStore";

/**
 * PostHog initialisation.
 *
 * Analogy: Sentry is the fire alarm — it tells you when
 * something breaks. PostHog is the store security camera
 * with people-counting sensors — it tells you where every
 * customer walks, what they pick up, and where they put it
 * back down before leaving. Both are essential. One tells
 * you about failures, the other tells you about behaviour.
 */
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host:                  process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles:           "identified_only",
    capture_pageview:          true,
    capture_pageleave:         true,
    session_recording: {
      maskAllInputs:           false,
      maskInputOptions:        { password: true },
    },
  });
}

/**
 * PostHogUserSync — mirrors what SentryUserSync does but for PostHog.
 *
 * Analogy: the same receptionist who tells Sentry who checked in
 * also hands PostHog a name badge. Now PostHog can tie every click,
 * every page view, every AI message to a real person with a name,
 * email, and business — not just an anonymous session ID.
 */
function PostHogUserSync() {
  const user = useBusinessStore((s) => s.user);
  const ph   = usePostHog();

  useEffect(() => {
    if (!ph) return;

    if (user) {
      ph.identify(String(user.id), {
        email:    user.email,
        name:     user.name,
        business: user.business,
      });
    } else {
      ph.reset();
    }
  }, [user, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogUserSync />
      {children}
    </PHProvider>
  );
}
