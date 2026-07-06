import {
  deleteMyPlace,
  fetchMyPlaces,
  syncMyPlaces,
  upsertMyPlace,
  type SavedPlaceRecord,
} from '@/lib/myPlacesApi';
import { authService } from '@/services/authService';
import {
  getSavedPlaces,
  isPlaceSaved,
  removeSavedPlace,
  replaceSavedPlacesFromServer,
  upsertSavedPlace,
} from '@/lib/savedPlacesStorage';
import type { SavedPlaceMeta } from '@/lib/savePlaceSlug';

let accountCache: SavedPlaceMeta[] | null = null;
let cacheUserId: string | null = null;
let loadInFlight: Promise<SavedPlaceMeta[]> | null = null;
let mergedGuestForUserId: string | null = null;

function dispatchSavedPlacesChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('dash-saved-places-changed'));
  }
}

function recordToMeta(record: SavedPlaceRecord): SavedPlaceMeta {
  return {
    slug: record.slug,
    title: record.title,
    image: record.image,
    locationLabel: record.locationLabel,
    source: record.source,
    lat: record.lat,
    lng: record.lng,
  };
}

export function invalidateAccountCache(): void {
  accountCache = null;
  cacheUserId = null;
  loadInFlight = null;
  mergedGuestForUserId = null;
}

export function getAccountCache(): SavedPlaceMeta[] {
  return accountCache ?? [];
}

/** Load saved places from account API (silent — does not re-trigger hydration). */
export async function loadAccountSavedPlaces(force = false): Promise<SavedPlaceMeta[]> {
  const user = authService.getCurrentUser();
  if (!user?.token) {
    invalidateAccountCache();
    return [];
  }

  if (!force && cacheUserId === user.id && accountCache) {
    return accountCache;
  }

  if (loadInFlight && !force) return loadInFlight;

  loadInFlight = (async () => {
    const remote = await fetchMyPlaces();
    accountCache = remote.map(recordToMeta);
    cacheUserId = user.id;
    replaceSavedPlacesFromServer(accountCache);
    dispatchSavedPlacesChanged();
    return accountCache;
  })();

  try {
    return await loadInFlight;
  } finally {
    loadInFlight = null;
  }
}

export function isSavedInAccount(slug: string): boolean {
  const user = authService.getCurrentUser();
  if (user?.token && accountCache) {
    return accountCache.some((place) => place.slug === slug);
  }
  if (user?.token) {
    return isPlaceSaved(slug);
  }
  return false;
}

export async function mergeGuestSavesOnLogin(): Promise<void> {
  const user = authService.getCurrentUser();
  if (!user?.token) return;
  if (mergedGuestForUserId === user.id) return;
  mergedGuestForUserId = user.id;

  const guest = getSavedPlaces();
  if (guest.length) {
    const synced = await syncMyPlaces(guest);
    if (synced.length) {
      accountCache = synced.map(recordToMeta);
      cacheUserId = user.id;
      replaceSavedPlacesFromServer(accountCache);
      dispatchSavedPlacesChanged();
      return;
    }
  }

  await loadAccountSavedPlaces(true);
}

export async function toggleAccountSavedPlace(
  meta: SavedPlaceMeta,
): Promise<{ saved: boolean; error?: 'login_required' | 'save_failed'; message?: string }> {
  const user = authService.getCurrentUser();
  if (!user?.token) {
    return { saved: false, error: 'login_required' };
  }

  await loadAccountSavedPlaces();
  const currentlySaved = accountCache?.some((place) => place.slug === meta.slug) ?? false;
  const next = !currentlySaved;

  const result = next ? await upsertMyPlace(meta) : await deleteMyPlace(meta.slug);
  if (!result.ok) {
    return {
      saved: currentlySaved,
      error: 'save_failed',
      message: result.error || 'Could not update saved places.',
    };
  }

  if (next) {
    accountCache = [meta, ...(accountCache || []).filter((place) => place.slug !== meta.slug)];
    upsertSavedPlace(meta);
  } else {
    accountCache = (accountCache || []).filter((place) => place.slug !== meta.slug);
    removeSavedPlace(meta.slug);
  }

  replaceSavedPlacesFromServer(accountCache);
  dispatchSavedPlacesChanged();
  return { saved: next };
}

export async function removeAccountSavedPlace(slug: string): Promise<boolean> {
  const user = authService.getCurrentUser();
  if (!user?.token) return false;

  const result = await deleteMyPlace(slug);
  if (!result.ok) return false;

  accountCache = (accountCache || []).filter((place) => place.slug !== slug);
  removeSavedPlace(slug);
  replaceSavedPlacesFromServer(accountCache);
  dispatchSavedPlacesChanged();
  return true;
}
