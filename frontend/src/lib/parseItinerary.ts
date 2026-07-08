/**
 * Parse SignPost API itinerary plain text into a structure suitable for
 * ItineraryTimeline / DayCard (same design as frontend).
 * See API.md "Parsing the itinerary response".
 */

import { assetPath } from '@/lib/basePath';
import { renameObsoletePlaceNames, sanitizePlaceLabel } from '@/lib/sanitizePlaceLabel';

const SLOT_ICONS: Record<string, string> = {
  MORNING: '🌅',
  AFTERNOON: '☀️',
  EVENING: '🌙',
};

export interface ParsedSlot {
  time: string;
  location: string;
  /** On-site visit duration only */
  duration: string;
  /** Transit from previous stop — never mixed into duration */
  travelTime: string;
  activities: string;
  why: string;
}

export interface ParsedDay {
  dayNum: number;
  baseCity: string;
  slots: ParsedSlot[];
}

export interface TripRouting {
  outboundFrom: string;
  outboundTo: string;
  outboundMode: string;
  outboundDuration: string;
  outboundNotes: string;
}

export interface ParsedItinerary {
  theme: string;
  region: string;
  routing?: TripRouting;
  days: ParsedDay[];
}

function normalizeItineraryText(raw: string): string {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  const lines = trimmed.split(/\r?\n/);
  let start = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^TRIP_THEME:/.test(line) || /^TRIP_ROUTING:/.test(line) || /^DAY_\d+:/.test(line)) {
      start = i;
      break;
    }
  }
  return lines.slice(start).join('\n');
}

/** Day-level metadata keys — never show inside slot descriptions. */
const METADATA_KEY_PATTERN =
  /^(OVERNIGHT_STAY|DAILY_TRAVEL_TIME_ESTIMATE|DAILY_ACTIVITY_INTENSITY|BEST_SEASON|DAILY_[A-Z_]+):/i;

/**
 * Smart-planner supplement sections. The model often appends these after the last
 * WHY_THIS_MATCHES_USER line; they belong only in the separate extras cards.
 */
export const ITINERARY_EXTRA_SECTION_KEYS = [
  'FOOD_RECOMMENDATIONS',
  'TRAVEL_TIPS',
  'BEST_TIME_TO_VISIT',
  'ESTIMATED_BUDGET',
  'NEARBY_PLACES',
  'RELATED_DESTINATIONS',
  'SIMILAR_EXPERIENCES',
  'HIDDEN_GEMS',
] as const;

const EXTRA_SECTION_KEY_ALT = ITINERARY_EXTRA_SECTION_KEYS.join('|');

const EXTRA_OR_META_LINE =
  new RegExp(`^(?:${EXTRA_SECTION_KEY_ALT}|OVERNIGHT_STAY|DAILY_TRAVEL_TIME_ESTIMATE|DAILY_ACTIVITY_INTENSITY|BEST_SEASON|DAILY_[A-Z_]+):`, 'i');

/** Cut supplemental / day-meta blocks that leaked into a slot field (same line or trailing). */
export function stripExtrasFromSlotText(s: string): string {
  if (typeof s !== 'string' || !s.trim()) return '';
  let out = s;
  out = out.replace(new RegExp(`(?:\\s|^)(?:${EXTRA_SECTION_KEY_ALT})\\s*:.*$`, 'is'), '');
  out = out.replace(
    /(\s+(?:OVERNIGHT_STAY|DAILY_TRAVEL_TIME_ESTIMATE|DAILY_ACTIVITY_INTENSITY|BEST_SEASON|DAILY_[A-Z_]+):[^\n]*)+$/gi,
    '',
  );
  return out.trim();
}

/** Format visit duration for display so it cannot be mistaken for travel time. */
export function formatVisitDurationLabel(raw: string): string {
  const s = stripExtrasFromSlotText(String(raw || '')).trim();
  if (!s) return '';
  if (/^visit\s*:/i.test(s) || /\bon\s+site\b/i.test(s)) return s;
  // Strip parenthetical travel notes the model sometimes glues onto VISIT_DURATION
  const withoutTravelParen = s
    .replace(/\s*\((?:travel|drive|flight|train|from|en\s*route)[^)]*\)\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!withoutTravelParen) return '';
  if (/^\d/i.test(withoutTravelParen) || /hr/i.test(withoutTravelParen)) {
    return `Visit: ${withoutTravelParen}${/\bon\s+site\b/i.test(withoutTravelParen) ? '' : ' on site'}`;
  }
  return withoutTravelParen;
}

export function formatTravelTimeLabel(raw: string): string {
  let s = stripExtrasFromSlotText(String(raw || '')).trim();
  if (!s) return '';
  if (/^travel\s*:/i.test(s)) return s;
  s = s.replace(/^(?:travel|drive|en\s*route)\s*(?:time\s*)?(?:[:\-–]\s*)?/i, '').trim();
  if (!s) return '';
  // Prefer a compact Transit: label when we only have a from→to note without hours
  if (!/\d/.test(s) && /\bfrom\b/i.test(s)) {
    return `Travel: ${s.replace(/^from\s+/i, 'from ')}`;
  }
  return `Travel: ${s}`;
}

export function parseItineraryText(raw: string): ParsedItinerary {
  const text = normalizeItineraryText(renameObsoletePlaceNames(raw));
  const lines = text.split(/\r?\n/).map((l) => (l && typeof l === 'string' ? l.trim() : '')).filter(Boolean);

  let theme = '';
  let region = '';
  const routing: TripRouting = {
    outboundFrom: '',
    outboundTo: '',
    outboundMode: '',
    outboundDuration: '',
    outboundNotes: '',
  };
  let inRouting = false;
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
      inRouting = false;
      continue;
    }
    if (line.startsWith('TRIP_ROUTING:')) {
      inRouting = true;
      continue;
    }
    if (inRouting) {
      if (line.startsWith('OUTBOUND_FROM:')) routing.outboundFrom = line.replace(/^OUTBOUND_FROM:\s*/, '').trim();
      else if (line.startsWith('OUTBOUND_TO:')) routing.outboundTo = line.replace(/^OUTBOUND_TO:\s*/, '').trim();
      else if (line.startsWith('OUTBOUND_MODE:')) routing.outboundMode = line.replace(/^OUTBOUND_MODE:\s*/, '').trim();
      else if (line.startsWith('OUTBOUND_DURATION:')) routing.outboundDuration = line.replace(/^OUTBOUND_DURATION:\s*/, '').trim();
      else if (line.startsWith('OUTBOUND_NOTES:')) routing.outboundNotes = line.replace(/^OUTBOUND_NOTES:\s*/, '').trim();
      else if (/^DAY_\d+:/.test(line)) {
        inRouting = false;
        // fall through to day parsing below
      } else {
        continue;
      }
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
        travelTime: '',
        activities: '',
        why: '',
      };
      if (currentDay) currentDay.slots.push(currentSlot);
      continue;
    }
    if (currentSlot) {
      if (line.startsWith('LOCATION:')) {
        currentSlot.location = sanitizePlaceLabel(line.replace(/^LOCATION:\s*/, '').trim());
      } else if (line.startsWith('TRAVEL_TIME_FROM_PREVIOUS:') || line.startsWith('TRAVEL_TIME:')) {
        currentSlot.travelTime = line
          .replace(/^TRAVEL_TIME(?:_FROM_PREVIOUS)?:\s*/i, '')
          .trim();
      } else if (line.startsWith('VISIT_DURATION:')) {
        currentSlot.duration = line.replace(/^VISIT_DURATION:\s*/, '').trim();
      } else if (line.startsWith('KEY_ACTIVITIES:')) {
        currentSlot.activities = line.replace(/^KEY_ACTIVITIES:\s*/, '').trim();
      } else if (line.startsWith('WHY_THIS_MATCHES_USER:')) {
        currentSlot.why = stripExtrasFromSlotText(
          line.replace(/^WHY_THIS_MATCHES_USER:\s*/, '').trim(),
        );
      } else if (EXTRA_OR_META_LINE.test(line) || METADATA_KEY_PATTERN.test(line)) {
        // Stop absorbing day content once supplements or day meta begin
        currentSlot = null;
      } else if (
        currentSlot.why !== '' &&
        !/^(LOCATION|VISIT_DURATION|TRAVEL_TIME|TRAVEL_TIME_FROM_PREVIOUS|KEY_ACTIVITIES|WHY_THIS_MATCHES_USER|MORNING|AFTERNOON|EVENING|DAY_\d+|BASE_CITY):/.test(
          line,
        )
      ) {
        // Guard: if a continuation line introduces an extras label mid-stream, drop from there
        if (new RegExp(`(?:${EXTRA_SECTION_KEY_ALT})\\s*:`, 'i').test(line)) {
          currentSlot.why = stripExtrasFromSlotText(`${currentSlot.why} ${line}`);
          currentSlot = null;
        } else {
          currentSlot.why += ' ' + line;
        }
      }
    }
  }

  for (const day of days) {
    for (const slot of day.slots) {
      slot.location = stripExtrasFromSlotText(slot.location);
      // Recover travel notes the model stuffed into VISIT_DURATION parentheses
      const durationRaw = stripExtrasFromSlotText(slot.duration);
      const smuggled = durationRaw.match(
        /\((?:travel|drive|flight|train)[^)]*from\s+([^)]+)\)/i,
      );
      if (smuggled && !slot.travelTime) {
        slot.travelTime = smuggled[0].replace(/^\(|\)$/g, '').trim();
      }
      // Also catch "2 hrs (travel from X to Y)" style
      const smuggled2 = durationRaw.match(/\(([^)]*(?:from|->|→)[^)]*)\)/i);
      if (smuggled2 && !slot.travelTime && /travel|drive|from|→|->/i.test(smuggled2[1])) {
        slot.travelTime = smuggled2[1].trim();
      }
      slot.duration = formatVisitDurationLabel(durationRaw);
      slot.travelTime = formatTravelTimeLabel(stripExtrasFromSlotText(slot.travelTime));
      slot.activities = stripExtrasFromSlotText(slot.activities);
      slot.why = stripExtrasFromSlotText(slot.why);
    }
  }

  const hasRouting = Boolean(
    routing.outboundFrom || routing.outboundTo || routing.outboundMode || routing.outboundDuration,
  );

  return {
    theme,
    region,
    routing: hasRouting ? routing : undefined,
    days,
  };
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
