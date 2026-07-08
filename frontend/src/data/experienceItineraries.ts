import type { Day } from '@/components/krtiv/data';
import { buildSinglePlaceItineraryDays, type RawItineraryDay } from '@/lib/singleDayItinerary';

import tadoba from './itineraries/experiences/tadoba-tiger-reserve.json';
import bhandardara from './itineraries/experiences/bhandardara-fireflies.json';
import flamingo from './itineraries/experiences/flamingo-watching.json';
import navegaon from './itineraries/experiences/navegaon-national-park.json';
import karnala from './itineraries/experiences/karnala-bird-sanctuary.json';
import thoseghar from './itineraries/experiences/thoseghar-waterfalls.json';
import devkund from './itineraries/experiences/devkund-waterfall.json';
import tamhini from './itineraries/experiences/tamhini-ghat.json';
import visapur from './itineraries/experiences/visapur-fort.json';

const RAW: Record<string, RawItineraryDay[]> = {
  'tadoba-tiger-reserve': tadoba as RawItineraryDay[],
  'bhandardara-fireflies': bhandardara as RawItineraryDay[],
  'flamingo-watching': flamingo as RawItineraryDay[],
  'navegaon-national-park': navegaon as RawItineraryDay[],
  'karnala-bird-sanctuary': karnala as RawItineraryDay[],
  'thoseghar-waterfalls': thoseghar as RawItineraryDay[],
  'devkund-waterfall': devkund as RawItineraryDay[],
  'tamhini-ghat': tamhini as RawItineraryDay[],
  'visapur-fort': visapur as RawItineraryDay[],
};

export function experienceItineraryDays(
  slug: string,
  locationTitle: string,
  gallery: string[],
): Day[] | undefined {
  const raw = RAW[slug];
  if (!raw) return undefined;
  return buildSinglePlaceItineraryDays(raw, locationTitle, gallery);
}
