/** Shared trip logistics for AI itinerary planners (client PDF requirements). */

import { getApiBase } from '@/lib/basePath';

export const TRAVEL_SEASONS = [
  { value: 'Summer (March–May)', label: 'Summer (March–May)' },
  { value: 'Monsoon (June–September)', label: 'Monsoon (June–September)' },
  { value: 'Winter (October–February)', label: 'Winter (October–February)' },
] as const;

export type TravelSeason = (typeof TRAVEL_SEASONS)[number]['value'];

/** Infer travel season from the current calendar month. */
export function inferTravelSeasonFromDate(date = new Date()): TravelSeason {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return TRAVEL_SEASONS[0].value;
  if (month >= 6 && month <= 9) return TRAVEL_SEASONS[1].value;
  return TRAVEL_SEASONS[2].value;
}

/** Resolve city from visitor IP via same-origin API route (no browser permission). */
export async function detectOriginCityFromIp(): Promise<string> {
  const res = await fetch(`${getApiBase()}/visitor-location`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not detect your city from IP.');
  const data = (await res.json()) as { city?: string };
  const city = String(data.city || '').trim();
  if (!city) throw new Error('Could not detect your city.');
  return city;
}

const MH_ORIGIN_HINTS = [
  'mumbai',
  'pune',
  'nagpur',
  'nashik',
  'chhatrapati sambhajinagar',
  'kolhapur',
  'thane',
  'navi mumbai',
  'solapur',
  'sangli',
  'satara',
  'ratnagiri',
  'alibaug',
  'lonavala',
  'mahabaleshwar',
  'shirdi',
  'nanded',
  'amravati',
  'jalgaon',
  'akola',
  'latur',
  'dhule',
  'chandrapur',
  'panvel',
  'kalyan',
  'vasai',
  'ulhasnagar',
  'bhiwandi',
  'maharashtra',
];

export function isOriginInMaharashtra(originCity: string): boolean {
  const norm = String(originCity || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  if (!norm) return true;
  return MH_ORIGIN_HINTS.some((hint) => norm === hint || norm.includes(hint));
}

/** Reverse-geocode lat/lng to a city name via OpenStreetMap Nominatim (no API key). */
export async function detectOriginCityFromGeolocation(): Promise<string> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('Location is not supported in this browser.');
  }
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 12000,
      maximumAge: 300000,
    });
  });
  const { latitude, longitude } = position.coords;
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Could not resolve your city from location.');
  const data = (await res.json()) as {
    address?: {
      city?: string;
      town?: string;
      village?: string;
      state_district?: string;
      state?: string;
    };
  };
  const addr = data.address || {};
  const city =
    addr.city || addr.town || addr.village || addr.state_district || addr.state || '';
  if (!city.trim()) throw new Error('Could not determine your city. Please enter it manually.');
  return city.trim();
}

/** Keywords injected into tourismKeywords so SignPost prompt rules apply consistently. */
export function buildPlannerLogisticsKeywords(opts: {
  originCity: string;
  travelSeason: TravelSeason | string;
  durationDays: string;
}): string[] {
  const origin = opts.originCity.trim() || 'Mumbai';
  const season = opts.travelSeason.trim() || TRAVEL_SEASONS[2].value;
  const outside = !isOriginInMaharashtra(origin);
  const lines = [
    `Travel season: ${season}`,
    `Starting location: ${origin}`,
    'Route optimization: order destinations geographically — shortest total road distance, minimum backtracking, logical map pin sequence (A → B → C). Never jump to a distant city when a nearer thematic stop exists.',
    'Group nearby attractions on the same day within the same city or district before moving to the next base.',
    'Include realistic travel time between each attraction in TRAVEL_TIME_FROM_PREVIOUS; never schedule back-to-back visits without transit time.',
    'VISIT_DURATION = on-site time only (label as Visit: N hrs). Travel time goes ONLY in TRAVEL_TIME_FROM_PREVIOUS with realistic hours (Shani Shingnapur/Shirdi to Mumbai ≈ 5–7 hrs road — never 2 hrs).',
    'Respect opening and closing hours — schedule visits only when attractions are open (typical monuments 9 AM–5:30 PM unless database says otherwise).',
    'Allocate enough visit duration on site — never start a visit within 30 minutes of closing time.',
    'Each slot must list VISIT_DURATION (on site) and, when relocating, TRAVEL_TIME_FROM_PREVIOUS; also set DAILY_TRAVEL_TIME_ESTIMATE.',
  ];
  if (outside) {
    lines.push(
      `Outbound journey: DAY_1 must begin with travel from ${origin} into Maharashtra (flight/train/bus as appropriate) before sightseeing.`,
      `Return journey: the final day must include travel from Maharashtra back to ${origin}.`,
      'Count inbound and return travel days inside DURATION_DAYS — do not assume the traveller is already in Maharashtra.',
    );
  } else {
    lines.push(
      `Origin ${origin} is in Maharashtra — DAY_1 must still open with departure from ${origin} and realistic transit to the first stop (road/rail); do not assume the traveller is already at the first attraction.`,
      `Return journey: the final day must include travel back to ${origin} or the nearest practical gateway city.`,
    );
  }
  if (season.includes('Summer')) {
    lines.push(
      'Summer rules: avoid monsoon-only waterfalls and firefly trails; prefer hill stations, early-morning outdoor visits, indoor museums midday.',
    );
  } else if (season.includes('Monsoon')) {
    lines.push(
      'Monsoon rules: prioritise waterfalls, mist ghats, and lush treks; avoid Kaas Plateau bloom (wrong season); warn on slippery trails; do not recommend dry-season-only desertscapes.',
    );
  } else if (season.includes('Winter')) {
    lines.push(
      'Winter rules: ideal for wildlife parks, heritage walks, vineyards, and Kaas Plateau when in bloom window (typically September–October overlaps early winter); comfortable for long city circuits.',
    );
  }
  return lines;
}
