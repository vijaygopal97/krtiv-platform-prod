import type { Activity, Day } from '@/components/krtiv/data';

import ajanta from './itineraries/timeless-icons/ajanta-caves.json';
import ellora from './itineraries/timeless-icons/ellora-caves.json';
import lonar from './itineraries/timeless-icons/lonar-crater.json';
import raigad from './itineraries/timeless-icons/raigad-fort.json';
import kaas from './itineraries/timeless-icons/kas-plateau.json';
import daulatabad from './itineraries/timeless-icons/daulatabad-fort.json';
import pagoda from './itineraries/timeless-icons/global-vipassana-pagoda.json';

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
  'ajanta-caves': ajanta as RawDay[],
  'ellora-caves': ellora as RawDay[],
  'lonar-crater': lonar as RawDay[],
  'raigad-fort': raigad as RawDay[],
  'kas-plateau': kaas as RawDay[],
  'daulatabad-fort': daulatabad as RawDay[],
  'global-vipassana-pagoda': pagoda as RawDay[],
};

export function timelessIconItineraryDays(
  slug: string,
  locationTitle: string,
  gallery: string[],
): Day[] | undefined {
  const raw = RAW[slug];
  if (!raw) return undefined;
  return toDays(raw, locationTitle, gallery);
}
