/**
 * Parse SignPost API itinerary plain text into a structure suitable for
 * ItineraryTimeline / DayCard (same design as frontend).
 * See API.md "Parsing the itinerary response".
 */

import { assetPath } from '@/lib/basePath';
import { sanitizePlaceLabel } from '@/lib/sanitizePlaceLabel';

const SLOT_ICONS: Record<string, string> = {
  MORNING: '🌅',
  AFTERNOON: '☀️',
  EVENING: '🌙',
};

export interface ParsedSlot {
  time: string;
  location: string;
  duration: string;
  activities: string;
  why: string;
}

export interface ParsedDay {
  dayNum: number;
  baseCity: string;
  slots: ParsedSlot[];
}

export interface ParsedItinerary {
  theme: string;
  region: string;
  days: ParsedDay[];
}

function normalizeItineraryText(raw: string): string {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  const lines = trimmed.split(/\r?\n/);
  let start = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^TRIP_THEME:/.test(line) || /^DAY_\d+:/.test(line)) {
      start = i;
      break;
    }
  }
  return lines.slice(start).join('\n');
}

/** Metadata keys from API we do not show in descriptions. */
const METADATA_KEY_PATTERN = /^(OVERNIGHT_STAY|DAILY_TRAVEL_TIME_ESTIMATE|DAILY_ACTIVITY_INTENSITY|BEST_SEASON|DAILY_[A-Z_]+):/i;

/** Remove trailing metadata key: value from description (e.g. inline in API response). */
function stripMetadataFromDescription(s: string): string {
  if (typeof s !== 'string') return '';
  return s
    .replace(/(\s+(?:OVERNIGHT_STAY|DAILY_TRAVEL_TIME_ESTIMATE|DAILY_ACTIVITY_INTENSITY|BEST_SEASON|DAILY_[A-Z_]+):[^\n]*)+$/gi, '')
    .trim();
}

export function parseItineraryText(raw: string): ParsedItinerary {
  const text = normalizeItineraryText(raw);
  const lines = text.split(/\r?\n/).map((l) => (l && typeof l === 'string' ? l.trim() : '')).filter(Boolean);

  let theme = '';
  let region = '';
  const days: ParsedDay[] = [];
  let currentDay: ParsedDay | null = null;
  let currentSlot: ParsedSlot | null = null;

  for (const line of lines) {
    if (line.startsWith('TRIP_THEME:')) {
      theme = line.replace(/^TRIP_THEME:\s*/, '').trim();
      continue;
    }
    if (line.startsWith('PRIMARY_REGION_CLUSTER:')) {
      region = line.replace(/^PRIMARY_REGION_CLUSTER:\s*/, '').trim();
      continue;
    }
    const dayMatch = line.match(/^DAY_(\d+):$/);
    if (dayMatch) {
      currentSlot = null;
      currentDay = {
        dayNum: parseInt(dayMatch[1], 10),
        baseCity: '',
        slots: [],
      };
      days.push(currentDay);
      continue;
    }
    if (line.startsWith('BASE_CITY:')) {
      const value = sanitizePlaceLabel(line.replace(/^BASE_CITY:\s*/, '').trim());
      if (currentDay) currentDay.baseCity = value;
      continue;
    }
    if (/^(MORNING|AFTERNOON|EVENING):$/.test(line)) {
      const time = line.replace(/:$/, '');
      currentSlot = {
        time,
        location: '',
        duration: '',
        activities: '',
        why: '',
      };
      if (currentDay) currentDay.slots.push(currentSlot);
      continue;
    }
    if (currentSlot) {
      if (line.startsWith('LOCATION:')) {
        currentSlot.location = sanitizePlaceLabel(line.replace(/^LOCATION:\s*/, '').trim());
      } else if (line.startsWith('VISIT_DURATION:')) {
        currentSlot.duration = line.replace(/^VISIT_DURATION:\s*/, '').trim();
      } else if (line.startsWith('KEY_ACTIVITIES:')) {
        currentSlot.activities = line.replace(/^KEY_ACTIVITIES:\s*/, '').trim();
      } else if (line.startsWith('WHY_THIS_MATCHES_USER:')) {
        currentSlot.why = line.replace(/^WHY_THIS_MATCHES_USER:\s*/, '').trim();
      } else if (
        currentSlot.why !== '' &&
        !/^(LOCATION|VISIT_DURATION|KEY_ACTIVITIES|WHY_THIS_MATCHES_USER|MORNING|AFTERNOON|EVENING|DAY_\d+|BASE_CITY):/.test(line) &&
        !METADATA_KEY_PATTERN.test(line)
      ) {
        currentSlot.why += ' ' + line;
      }
    }
  }

  for (const day of days) {
    for (const slot of day.slots) {
      slot.why = stripMetadataFromDescription(slot.why);
    }
  }

  return { theme, region, days };
}

/**
 * Map parsed itinerary to the shape expected by ItineraryTimeline / DayCard.
 * Uses categoryDayImages for day images (one per day index).
 */
export interface TimelineDay {
  day: number;
  location: string;
  image: string;
  activities: Array<{
    time: string;
    title: string;
    duration: string;
    description: string;
    details: string;
    icon: string;
  }>;
}

export function parsedToTimelineDays(
  parsed: ParsedItinerary,
  categoryDayImages: string[]
): TimelineDay[] {
  if (!parsed || !Array.isArray(parsed.days) || parsed.days.length === 0) return [];
  const defaultImage = categoryDayImages?.[0] ?? assetPath('/hero-image.jpeg');
  return parsed.days.map((d, i) => ({
    day: d.dayNum,
    location: d.baseCity || `Day ${d.dayNum}`,
    image: categoryDayImages[i] ?? defaultImage,
    activities: (Array.isArray(d.slots) ? d.slots : []).map((s) => ({
      time: s.time,
      title: s.location,
      duration: s.duration,
      description: s.activities,
      details: s.why,
      icon: SLOT_ICONS[s.time] ?? '📍',
    })),
  }));
}
