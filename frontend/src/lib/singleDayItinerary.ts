import type { Activity, Day } from '@/components/krtiv/data';

export type RawItineraryDay = {
  day: number;
  slots: [string, string, string, string][];
};

const ICON: Record<string, string> = {
  MORNING: '🌅',
  AFTERNOON: '☀️',
  EVENING: '🌇',
};

function toActivities(slots: RawItineraryDay['slots']): Activity[] {
  return slots.map(([time, title, description, details]) => ({
    time,
    title,
    duration: '',
    description,
    details,
    icon: ICON[time] ?? '📍',
  }));
}

function primaryLocationLabel(day: RawItineraryDay, fallback: string): string {
  const firstTitle = day.slots[0]?.[1];
  if (!firstTitle) return fallback;
  return firstTitle.split(/[,&]/)[0].trim() || fallback;
}

/** One focused day per place — morning, afternoon, evening at the same destination. */
export function buildSinglePlaceItineraryDays(
  raw: RawItineraryDay[],
  locationTitle: string,
  images: string | string[],
): Day[] {
  const day = raw[0];
  if (!day) return [];
  const gallery = Array.isArray(images) ? images : [images];
  return [
    {
      day: 1,
      location: primaryLocationLabel(day, locationTitle),
      image: gallery[0] ?? '',
      activities: toActivities(day.slots),
    },
  ];
}
