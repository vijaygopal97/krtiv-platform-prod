import type { Activity, Day } from '@/components/krtiv/data';

import tadoba from './itineraries/experiences/tadoba-tiger-reserve.json';
import bhandardara from './itineraries/experiences/bhandardara-fireflies.json';
import flamingo from './itineraries/experiences/flamingo-watching.json';
import navegaon from './itineraries/experiences/navegaon-national-park.json';
import karnala from './itineraries/experiences/karnala-bird-sanctuary.json';
import thoseghar from './itineraries/experiences/thoseghar-waterfalls.json';
import devkund from './itineraries/experiences/devkund-waterfall.json';
import tamhini from './itineraries/experiences/tamhini-ghat.json';
import visapur from './itineraries/experiences/visapur-fort.json';

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

function toDays(raw: RawDay[], location: string, images: string[]): Day[] {
  return raw.map((d, i) => ({
    day: d.day,
    location,
    image: images[i % images.length] ?? images[0],
    activities: toActivities(d.slots),
  }));
}

const RAW: Record<string, RawDay[]> = {
  'tadoba-tiger-reserve': tadoba as RawDay[],
  'bhandardara-fireflies': bhandardara as RawDay[],
  'flamingo-watching': flamingo as RawDay[],
  'navegaon-national-park': navegaon as RawDay[],
  'karnala-bird-sanctuary': karnala as RawDay[],
  'thoseghar-waterfalls': thoseghar as RawDay[],
  'devkund-waterfall': devkund as RawDay[],
  'tamhini-ghat': tamhini as RawDay[],
  'visapur-fort': visapur as RawDay[],
};

export function experienceItineraryDays(
  slug: string,
  locationTitle: string,
  gallery: string[],
): Day[] | undefined {
  const raw = RAW[slug];
  if (!raw) return undefined;
  return toDays(raw, locationTitle, gallery);
}
