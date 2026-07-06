import type { Activity, Day } from '@/components/krtiv/data';

import ajanta from './itineraries/unesco/ajanta-caves.json';
import ellora from './itineraries/unesco/ellora-caves.json';
import elephanta from './itineraries/unesco/elephanta-caves.json';
import csmt from './itineraries/unesco/csmt.json';
import westernGhats from './itineraries/unesco/western-ghats.json';
import artDeco from './itineraries/unesco/art-deco-mumbai.json';
import maratha from './itineraries/unesco/maratha-military-landscapes.json';

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
  'elephanta-caves': elephanta as RawDay[],
  csmt: csmt as RawDay[],
  'western-ghats': westernGhats as RawDay[],
  'art-deco-mumbai': artDeco as RawDay[],
  'maratha-military-landscapes': maratha as RawDay[],
};

export function unescoItineraryDays(
  slug: string,
  locationTitle: string,
  gallery: string[],
): Day[] | undefined {
  const raw = RAW[slug];
  if (!raw) return undefined;
  return toDays(raw, locationTitle, gallery);
}
