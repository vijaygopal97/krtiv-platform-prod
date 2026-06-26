import type { CategoryItinerary } from './data';
import { MAHARASHTRA_BOUNDARY_PATH } from './maharashtraBoundary';

export const MAHARASHTRA_MAP_TRANSFORM = 'translate(4 2) scale(0.92)';

const COORDS: Array<{ match: RegExp; lat: number; lng: number; label?: string }> = [
  { match: /igatpuri/i, lat: 19.69, lng: 73.55 },
  { match: /malshej/i, lat: 19.35, lng: 73.77 },
  { match: /lonavala/i, lat: 18.75, lng: 73.41 },
  { match: /raigad/i, lat: 18.23, lng: 73.44 },
  { match: /pune/i, lat: 18.52, lng: 73.86 },
  { match: /aurangabad|chhatrapati sambhaji/i, lat: 19.88, lng: 75.34 },
  { match: /nashik/i, lat: 19.99, lng: 73.79 },
  { match: /shirdi/i, lat: 19.77, lng: 74.48 },
  { match: /bhimashankar/i, lat: 19.07, lng: 73.53 },
  { match: /alibaug/i, lat: 18.64, lng: 72.87 },
  { match: /mahabaleshwar/i, lat: 17.92, lng: 73.66 },
  { match: /kolhapur/i, lat: 16.7, lng: 74.24 },
  { match: /mumbai/i, lat: 19.07, lng: 72.87 },
  { match: /paithan/i, lat: 19.48, lng: 75.38 },
  { match: /warli/i, lat: 19.8, lng: 72.95, label: 'Warli Country' },
  { match: /nagpur/i, lat: 21.15, lng: 79.09 },
  { match: /chandrapur|tadoba/i, lat: 20.2858, lng: 79.4166 },
  { match: /ajanta|ellora/i, lat: 20.2, lng: 75.4 },
  { match: /sindhudurg|malvan|tarkarli/i, lat: 16.17, lng: 73.56 },
];

const BOUNDS = { minLat: 15.5, maxLat: 22.2, minLng: 72.5, maxLng: 80.9 };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x, y };
}

function lookup(location: string) {
  for (const c of COORDS) if (c.match.test(location)) return c;
  return null;
}

export type MapPoint = {
  x: number;
  y: number;
  day: CategoryItinerary['days'][number];
  index: number;
};

export function getMaharashtraMapPoints(itinerary: CategoryItinerary): MapPoint[] {
  return itinerary.days
    .map((d, idx) => {
      const c = lookup(d.location);
      if (!c) return null;
      const p = project(c.lat, c.lng);
      return { ...p, day: d, index: idx };
    })
    .filter(Boolean) as MapPoint[];
}

export { MAHARASHTRA_BOUNDARY_PATH };
