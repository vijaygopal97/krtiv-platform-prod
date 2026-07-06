'use client';

import { useEffect } from 'react';
import { authService } from '@/services/authService';
import { invalidateAccountCache, loadAccountSavedPlaces, mergeGuestSavesOnLogin } from '@/lib/savedPlacesAccount';

function scheduleIdle(fn: () => void, timeoutMs: number): () => void {
  const delay = Math.min(timeoutMs, 200);
  const id = setTimeout(fn, delay);
  return () => clearTimeout(id);
}

/** One-time account saved-places hydration per session (auth changes only). */
export function SavedPlacesHydrator() {
  useEffect(() => {
    let cancelled = false;
    let cancelSchedule: (() => void) | null = null;

    const hydrate = async () => {
      const user = authService.getCurrentUser();
      if (!user?.token) {
        invalidateAccountCache();
        return;
      }
      await mergeGuestSavesOnLogin();
      if (!cancelled) await loadAccountSavedPlaces();
    };

    const scheduleHydrate = (timeoutMs = 2000) => {
      cancelSchedule?.();
      cancelSchedule = scheduleIdle(() => {
        if (!cancelled) void hydrate();
      }, timeoutMs);
    };

    scheduleHydrate();

    const onAuthChange = () => {
      const user = authService.getCurrentUser();
      if (!user?.token) invalidateAccountCache();
      scheduleHydrate(500);
    };
    window.addEventListener('krtiv-auth-changed', onAuthChange);

    return () => {
      cancelled = true;
      cancelSchedule?.();
      window.removeEventListener('krtiv-auth-changed', onAuthChange);
    };
  }, []);

  return null;
}
