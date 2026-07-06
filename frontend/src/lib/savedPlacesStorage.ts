/** Client-side saved places with optional account sync. */

import type { SavedPlaceMeta } from '@/lib/savePlaceSlug';

const STORAGE_KEY = 'dash-saved-places-v2';
const LEGACY_KEY = 'dash-saved-place-slugs';

function dispatchSavedPlacesChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('dash-saved-places-changed'));
  }
}

function readLegacySlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

function migrateLegacy(): SavedPlaceMeta[] {
  return readLegacySlugs().map((slug) => ({ slug }));
}

export function getSavedPlaces(): SavedPlaceMeta[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = migrateLegacy();
      if (legacy.length) {
        setSavedPlaces(legacy);
        return legacy;
      }
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => {
        if (typeof entry === 'string') return { slug: entry };
        if (entry && typeof entry === 'object' && typeof (entry as SavedPlaceMeta).slug === 'string') {
          return entry as SavedPlaceMeta;
        }
        return null;
      })
      .filter((p): p is SavedPlaceMeta => p != null);
  } catch {
    return [];
  }
}

export function setSavedPlaces(places: SavedPlaceMeta[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  dispatchSavedPlacesChanged();
}

export function getSavedPlaceSlugs(): string[] {
  return getSavedPlaces().map((p) => p.slug);
}

export function isPlaceSaved(slug: string): boolean {
  return getSavedPlaces().some((p) => p.slug === slug);
}

export function upsertSavedPlace(meta: SavedPlaceMeta): void {
  const existing = getSavedPlaces();
  const idx = existing.findIndex((p) => p.slug === meta.slug);
  const merged: SavedPlaceMeta =
    idx >= 0 ? { ...existing[idx], ...meta } : meta;
  const next = idx >= 0 ? existing.map((p, i) => (i === idx ? merged : p)) : [merged, ...existing];
  setSavedPlaces(next);
}

export function removeSavedPlace(slug: string): void {
  setSavedPlaces(getSavedPlaces().filter((p) => p.slug !== slug));
}

export function toggleSavedPlace(meta: SavedPlaceMeta): boolean {
  if (isPlaceSaved(meta.slug)) {
    removeSavedPlace(meta.slug);
    return false;
  }
  upsertSavedPlace(meta);
  return true;
}

/** @deprecated Use removeSavedPlace */
export function removeSavedPlaceSlug(slug: string): void {
  removeSavedPlace(slug);
}

/** @deprecated Use upsertSavedPlace */
export function addSavedPlaceSlug(slug: string): void {
  upsertSavedPlace({ slug });
}

/** @deprecated Use setSavedPlaces */
export function setSavedPlaceSlugs(slugs: string[]): void {
  setSavedPlaces(slugs.map((slug) => ({ slug })));
}

export function replaceSavedPlacesFromServer(places: SavedPlaceMeta[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
}

export function mergeSavedPlaces(remote: SavedPlaceMeta[]): SavedPlaceMeta[] {
  const local = getSavedPlaces();
  const bySlug = new Map<string, SavedPlaceMeta>();
  for (const place of [...remote, ...local]) {
    const prev = bySlug.get(place.slug);
    bySlug.set(place.slug, prev ? { ...prev, ...place } : place);
  }
  const merged = Array.from(bySlug.values());
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }
  return merged;
}
