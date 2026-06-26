import type { Activity, Day } from '@/components/krtiv/data';

import mumbai from './itineraries/mumbai.json';
import pune from './itineraries/pune.json';
import nashik from './itineraries/nashik.json';
import ajantaEllora from './itineraries/ajanta-ellora.json';
import shirdi from './itineraries/shirdi.json';
import mahabaleshwar from './itineraries/mahabaleshwar.json';
import lonavala from './itineraries/lonavala.json';
import alibaug from './itineraries/alibaug.json';
import kolhapur from './itineraries/kolhapur.json';
import nagpur from './itineraries/nagpur.json';
import sindhudurg from './itineraries/sindhudurg.json';
import chandrapur from './itineraries/chandrapur.json';

type RawDay = {
  day: number;
  slots: [string, string, string, string][];
};

const ICON: Record<string, string> = {
  MORNING: '🌅',
  AFTERNOON: '☀️',
  EVENING: '🌇',
};

function toActivities(slots: RawDay['slots']): Activity[] {
  return slots.map(([time, title, description, details]) => ({
    time,
    title,
    duration: '',
    description,
    details,
    icon: ICON[time] ?? '📍',
  }));
}

function toDays(raw: RawDay[], location: string, image: string): Day[] {
  return raw.map((d) => ({
    day: d.day,
    location,
    image,
    activities: toActivities(d.slots),
  }));
}

const RAW: Record<string, RawDay[]> = {
  mumbai: mumbai as RawDay[],
  pune: pune as RawDay[],
  nashik: nashik as RawDay[],
  'ajanta-ellora': ajantaEllora as RawDay[],
  shirdi: shirdi as RawDay[],
  mahabaleshwar: mahabaleshwar as RawDay[],
  lonavala: lonavala as RawDay[],
  alibaug: alibaug as RawDay[],
  kolhapur: kolhapur as RawDay[],
  nagpur: nagpur as RawDay[],
  sindhudurg: sindhudurg as RawDay[],
  chandrapur: chandrapur as RawDay[],
};

/** Client-approved 3-day itineraries for Places to Go destinations. */
export function approvedItineraryDays(
  slug: string,
  locationTitle: string,
  heroImage: string
): Day[] | undefined {
  const raw = RAW[slug];
  if (!raw) return undefined;
  return toDays(raw, locationTitle, heroImage);
}

export const APPROVED_ITINERARY_SLUGS = Object.keys(RAW);
