"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { useBusinessStore } from "@/store/useBusinessStore";

/**
 * SentryUserSync — mounts once at the app root.
 *
 * Problem it solves: Zustand persist rehydrates the user from
 * localStorage on every page load, but Sentry starts blank.
 * This component bridges the gap — as soon as the store has a
 * user, it tells Sentry who they are.
 *
 * Analogy: the night security guard reading yesterday's check-in
 * ledger at the start of their shift, so they know who's already
 * in the building before anyone new arrives.
 */
export function SentryUserSync() {
  const user = useBusinessStore(s => s.user);

  useEffect(() => {
    if (user) {
      Sentry.setUser({
        id:       String(user.id),
        email:    user.email,
        username: user.name,
        business: user.business,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);

  return null;
}
