'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { SavedPlaceMeta } from '@/lib/savePlaceSlug';
import { authService } from '@/services/authService';
import {
  getAccountCache,
  isSavedInAccount,
  loadAccountSavedPlaces,
  toggleAccountSavedPlace,
} from '@/lib/savedPlacesAccount';

export function useSavedPlace(meta: SavedPlaceMeta) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    const user = authService.getCurrentUser();
    if (user?.token) {
      setSaved(isSavedInAccount(meta.slug));
      return;
    }
    setSaved(false);
  }, [meta.slug]);

  useEffect(() => {
    refresh();

    const onChange = () => refresh();
    window.addEventListener('dash-saved-places-changed', onChange);
    return () => window.removeEventListener('dash-saved-places-changed', onChange);
  }, [meta.slug, refresh]);

  const toggle = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
      if (busy) return saved;

      const user = authService.getCurrentUser();
      if (!user?.token) {
        const next = pathname && pathname !== '/' ? `/login?next=${encodeURIComponent(pathname)}` : '/login';
        router.push(next);
        return false;
      }

      setBusy(true);
      const result = await toggleAccountSavedPlace(meta);
      setBusy(false);

      if (result.error === 'login_required') {
        router.push(`/login?next=${encodeURIComponent(pathname || '/')}`);
        return false;
      }

      if (result.error) {
        setSaved(isSavedInAccount(meta.slug));
        return isSavedInAccount(meta.slug);
      }

      setSaved(result.saved);
      return result.saved;
    },
    [busy, meta, pathname, router, saved],
  );

  return { saved, busy, toggle };
}

export function useSavedPlacesList() {
  const [places, setPlaces] = useState<SavedPlaceMeta[]>([]);

  const refresh = useCallback(() => {
    const user = authService.getCurrentUser();
    setPlaces(user?.token ? getAccountCache() : []);
  }, []);

  useEffect(() => {
    void (async () => {
      const user = authService.getCurrentUser();
      if (user?.token && !getAccountCache().length) {
        await loadAccountSavedPlaces();
      }
      refresh();
    })();

    const onChange = () => refresh();
    window.addEventListener('dash-saved-places-changed', onChange);
    return () => window.removeEventListener('dash-saved-places-changed', onChange);
  }, [refresh]);

  return places;
}
