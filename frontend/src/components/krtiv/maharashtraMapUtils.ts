import type { CategoryItinerary } from './data';
import type { ParsedItinerary } from '@/lib/parseItinerary';

/** Ordered — first match wins (more specific patterns first). */
const COORDS: Array<{ match: RegExp; lat: number; lng: number; label?: string }> = [
  { match: /gateway of india|colaba heritage/i, lat: 18.922, lng: 72.8343, label: 'Gateway of India' },
  { match: /elephanta/i, lat: 18.9633, lng: 72.9315, label: 'Elephanta Caves' },
  { match: /marine drive|chowpatty|queen'?s necklace/i, lat: 18.9432, lng: 72.8236, label: 'Marine Drive' },
  { match: /chhatrapati shivaji|csmt|cst|victoria terminus/i, lat: 18.9402, lng: 72.8352, label: 'CSMT Mumbai' },
  { match: /bandra|bandstand|worli sea|sea link/i, lat: 19.0544, lng: 72.8265, label: 'Bandra-Worli' },
  { match: /juhu beach|juhu/i, lat: 19.0988, lng: 72.8268, label: 'Juhu' },
  { match: /siddhivinayak/i, lat: 19.017, lng: 72.8303, label: 'Siddhivinayak' },
  { match: /haji ali/i, lat: 18.9827, lng: 72.8089, label: 'Haji Ali' },
  { match: /kala ghoda|csmvs/i, lat: 18.9269, lng: 72.8328, label: 'Kala Ghoda' },
  { match: /crawford market/i, lat: 18.947, lng: 72.8355, label: 'Crawford Market' },
  { match: /bkc|jio world/i, lat: 19.066, lng: 72.867, label: 'BKC Mumbai' },
  { match: /kalsubai/i, lat: 19.6012, lng: 73.7463, label: 'Kalsubai Peak' },
  { match: /bhandardara|arthur lake/i, lat: 19.552, lng: 73.751, label: 'Bhandardara' },
  { match: /harishchandragad|konkan kada/i, lat: 19.393, lng: 73.778, label: 'Harishchandragad' },
  { match: /malshej/i, lat: 19.353, lng: 73.775, label: 'Malshej Ghat' },
  { match: /rajmachi|bhushi/i, lat: 18.748, lng: 73.406, label: 'Lonavala region' },
  { match: /igatpuri/i, lat: 19.695, lng: 73.553, label: 'Igatpuri' },
  { match: /raigad|maha darwaja/i, lat: 18.235, lng: 73.442, label: 'Raigad Fort' },
  { match: /shaniwar wada/i, lat: 18.5196, lng: 73.8553, label: 'Shaniwar Wada' },
  { match: /aga khan/i, lat: 18.5526, lng: 73.9016, label: 'Aga Khan Palace' },
  { match: /kelkar museum/i, lat: 18.5088, lng: 73.8535, label: 'Kelkar Museum' },
  { match: /koregaon park|fc road/i, lat: 18.5362, lng: 73.8939, label: 'Pune' },
  { match: /ajanta/i, lat: 20.5519, lng: 75.7033, label: 'Ajanta Caves' },
  { match: /ellora|kailasa/i, lat: 20.0264, lng: 75.1792, label: 'Ellora Caves' },
  { match: /bibi ka maqbara/i, lat: 19.901, lng: 75.3203, label: 'Bibi Ka Maqbara' },
  { match: /panchakki/i, lat: 19.8896, lng: 75.3147, label: 'Panchakki' },
  { match: /trimbakeshwar|trimbak/i, lat: 19.9322, lng: 73.5291, label: 'Trimbakeshwar' },
  { match: /panchavati|ram kund|godavari/i, lat: 19.9975, lng: 73.7898, label: 'Nashik' },
  { match: /sula|vineyard|nashik wine/i, lat: 20.0074, lng: 73.684, label: 'Nashik Vineyards' },
  { match: /shirdi|sai baba/i, lat: 19.7645, lng: 74.477, label: 'Shirdi' },
  { match: /bhimashankar/i, lat: 19.072, lng: 73.536, label: 'Bhimashankar' },
  { match: /murud|janjira/i, lat: 18.299, lng: 72.964, label: 'Murud Janjira' },
  { match: /kolaba fort/i, lat: 18.638, lng: 72.873, label: 'Kolaba Fort' },
  { match: /alibaug|mandwa|konkan coast/i, lat: 18.6414, lng: 72.8722, label: 'Alibaug' },
  { match: /mahabaleshwar|mapro|wilson point|venna/i, lat: 17.9239, lng: 73.6586, label: 'Mahabaleshwar' },
  { match: /kolhapur|misal|tambda|mahalaxmi temple/i, lat: 16.705, lng: 74.2433, label: 'Kolhapur' },
  { match: /deekshabhoomi/i, lat: 21.128, lng: 79.0676, label: 'Deekshabhoomi' },
  { match: /futala lake/i, lat: 21.117, lng: 79.058, label: 'Futala Lake' },
  { match: /ambazari/i, lat: 21.122, lng: 79.065, label: 'Ambazari Lake' },
  { match: /paithan|paithani/i, lat: 19.478, lng: 75.38, label: 'Paithan' },
  { match: /warli/i, lat: 19.8, lng: 72.95, label: 'Warli Country' },
  { match: /tadoba|chandrapur|tiger reserve/i, lat: 20.2858, lng: 79.4166, label: 'Tadoba' },
  { match: /tarkarli|malvan|sindhudurg/i, lat: 16.17, lng: 73.56, label: 'Sindhudurg' },
  { match: /lonavala/i, lat: 18.7484, lng: 73.4065, label: 'Lonavala' },
  { match: /matheran/i, lat: 18.986, lng: 73.265, label: 'Matheran' },
  { match: /pune/i, lat: 18.5204, lng: 73.8567, label: 'Pune' },
  { match: /mumbai/i, lat: 19.076, lng: 72.8777, label: 'Mumbai' },
  { match: /nashik/i, lat: 19.9975, lng: 73.7898, label: 'Nashik' },
  { match: /nagpur|orange country/i, lat: 21.1458, lng: 79.0882, label: 'Nagpur' },
  { match: /aurangabad|chhatrapati sambhaji/i, lat: 19.8762, lng: 75.3433, label: 'Aurangabad' },
  { match: /pandharpur/i, lat: 17.679, lng: 75.331, label: 'Pandharpur' },
  { match: /shani shingnapur/i, lat: 19.75, lng: 74.85, label: 'Shani Shingnapur' },
  { match: /karnala/i, lat: 18.883, lng: 73.12, label: 'Karnala' },
  { match: /malvan/i, lat: 16.05, lng: 73.47, label: 'Malvan' },
];

const BOUNDS = { minLat: 15.5, maxLat: 22.2, minLng: 72.5, maxLng: 80.9 };

function lookup(text: string) {
  if (!text) return null;
  for (const c of COORDS) {
    if (c.match.test(text)) return c;
  }
  return null;
}

function resolveDayCoords(day: CategoryItinerary['days'][number]) {
  const genericCity = /^(mumbai|pune|nashik|nagpur|kolhapur|alibaug|lonavala|shirdi|mahabaleshwar)$/i;
  if (!genericCity.test(day.location.trim())) {
    const fromLocation = lookup(day.location);
    if (fromLocation) {
      return {
        lat: fromLocation.lat,
        lng: fromLocation.lng,
        label: fromLocation.label || day.location,
      };
    }
  }

  for (const a of day.activities) {
    const fromActivity = lookup(a.title) || lookup(a.description) || lookup(a.details);
    if (fromActivity) {
      return {
        lat: fromActivity.lat,
        lng: fromActivity.lng,
        label: fromActivity.label || a.title.split(/[,&]/)[0].trim(),
      };
    }
  }

  const fallback = lookup(day.location);
  if (fallback) {
    return { lat: fallback.lat, lng: fallback.lng, label: fallback.label || day.location };
  }
  return null;
}

export type GeoMapPoint = {
  lat: number;
  lng: number;
  label: string;
  day: CategoryItinerary['days'][number];
  index: number;
};

/** @deprecated SVG projection — use getItineraryGeoPoints */
export type MapPoint = GeoMapPoint & { x: number; y: number };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x, y };
}

function spreadOverlappingPins(points: GeoMapPoint[]): GeoMapPoint[] {
  const seen = new Map<string, number>();
  return points.map((p) => {
    const key = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
    const count = seen.get(key) ?? 0;
    seen.set(key, count + 1);
    if (count === 0) return p;
    const angle = (count * 72 * Math.PI) / 180;
    const offset = 0.012 * count;
    return {
      ...p,
      lat: p.lat + Math.sin(angle) * offset,
      lng: p.lng + Math.cos(angle) * offset,
    };
  });
}

export function getItineraryGeoPoints(itinerary: CategoryItinerary): GeoMapPoint[] {
  const raw = itinerary.days
    .map((d, idx) => {
      const c = resolveDayCoords(d);
      if (!c) return null;
      return { ...c, day: d, index: idx };
    })
    .filter(Boolean) as GeoMapPoint[];
  return spreadOverlappingPins(raw);
}

/** Backward-compatible alias used by MaharashtraMapVisual / MaharashtraMap */
export function getMaharashtraMapPoints(itinerary: CategoryItinerary): MapPoint[] {
  return getItineraryGeoPoints(itinerary).map((p) => ({
    ...p,
    ...project(p.lat, p.lng),
  }));
}

export function parsedItineraryToMapShape(parsed: ParsedItinerary): CategoryItinerary {
  return {
    slug: 'generated',
    title: parsed.theme || 'Generated itinerary',
    subtitle: parsed.region || 'Maharashtra',
    description: parsed.region || '',
    hero: '',
    accent: '',
    region: parsed.region || 'Maharashtra',
    days: parsed.days.map((d) => {
      const primarySlot = d.slots.find((s) => s.location) ?? d.slots[0];
      const location = d.baseCity || primarySlot?.location || `Day ${d.dayNum}`;
      return {
        day: d.dayNum,
        location,
        image: '',
        activities: d.slots.map((s) => ({
          time: s.time,
          title: s.location || s.activities,
          duration: s.duration,
          description: s.activities,
          details: `${s.why} ${s.location}`.trim(),
          icon: '📍',
        })),
      };
    }),
  };
}

/** Showcase map for homepage — major Places to Go destinations */
export function getHomepageMapItinerary(): CategoryItinerary {
  const stops = [
    { day: 1, location: 'Mumbai', lat: 19.076, lng: 72.8777 },
    { day: 2, location: 'Pune', lat: 18.5204, lng: 73.8567 },
    { day: 3, location: 'Nashik', lat: 19.9975, lng: 73.7898 },
    { day: 4, location: 'Ajanta Caves', lat: 20.5519, lng: 75.7033 },
    { day: 5, location: 'Lonavala', lat: 18.7484, lng: 73.4065 },
    { day: 6, location: 'Kolhapur', lat: 16.705, lng: 74.2433 },
  ];
  return {
    slug: 'home-overview',
    title: 'Maharashtra',
    subtitle: 'Places to discover',
    description: 'Major destinations across the state',
    hero: '',
    accent: 'Explore',
    region: 'Maharashtra',
    days: stops.map((s) => ({
      day: s.day,
      location: s.location,
      image: '',
      activities: [{ time: 'Visit', title: s.location, duration: '', description: '', details: '', icon: '📍' }],
    })),
  };
}
