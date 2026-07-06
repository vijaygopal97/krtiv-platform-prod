import { getDestination } from '@/data/destinations';
import { resolveDestinationSlug } from '@/lib/destinationRedirects';
import type { SavedPlaceMeta } from '@/lib/savePlaceSlug';
import { displayNameForSlug } from '@/lib/savePlaceSlug';

export type RouteStop = {
  slug: string;
  label: string;
  lat: number;
  lng: number;
};

const ORIGIN_COORDS: Record<string, { lat: number; lng: number }> = {
  mumbai: { lat: 19.076, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  nashik: { lat: 19.9975, lng: 73.7898 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
};

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function resolveOriginCoords(originCity: string): { lat: number; lng: number; label: string } {
  const key = originCity.trim().toLowerCase();
  for (const [name, coords] of Object.entries(ORIGIN_COORDS)) {
    if (key.includes(name)) {
      return { ...coords, label: name.charAt(0).toUpperCase() + name.slice(1) };
    }
  }
  return { ...ORIGIN_COORDS.mumbai, label: originCity.trim() || 'Mumbai' };
}

export function savedPlaceToRouteStop(place: SavedPlaceMeta): RouteStop | null {
  const canonical = resolveDestinationSlug(place.slug);
  const dest = getDestination(canonical);
  if (dest?.map) {
    return {
      slug: place.slug,
      label: dest.title,
      lat: dest.map.lat,
      lng: dest.map.lng,
    };
  }
  if (typeof place.lat === 'number' && typeof place.lng === 'number') {
    return {
      slug: place.slug,
      label: displayNameForSlug(place.slug, place.title || place.locationLabel),
      lat: place.lat,
      lng: place.lng,
    };
  }
  if (place.title || place.locationLabel) {
    return {
      slug: place.slug,
      label: displayNameForSlug(place.slug, place.title || place.locationLabel),
      lat: ORIGIN_COORDS.mumbai.lat,
      lng: ORIGIN_COORDS.mumbai.lng,
    };
  }
  return null;
}

/** Greedy nearest-neighbor route from a starting city through all saved stops. */
export function optimizeRouteOrder(originCity: string, places: SavedPlaceMeta[]): RouteStop[] {
  const origin = resolveOriginCoords(originCity);
  const stops = places
    .map(savedPlaceToRouteStop)
    .filter((s): s is RouteStop => s != null);

  if (stops.length <= 1) return stops;

  const remaining = [...stops];
  const ordered: RouteStop[] = [];
  let cursor = { lat: origin.lat, lng: origin.lng };

  while (remaining.length) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(cursor, remaining[i]);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    const next = remaining.splice(bestIdx, 1)[0];
    ordered.push(next);
    cursor = { lat: next.lat, lng: next.lng };
  }

  return ordered;
}
