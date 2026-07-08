import type { Day } from '@/components/krtiv/data';
import { buildSinglePlaceItineraryDays, type RawItineraryDay } from '@/lib/singleDayItinerary';

import ajanta from './itineraries/unesco/ajanta-caves.json';
import ellora from './itineraries/unesco/ellora-caves.json';
import elephanta from './itineraries/unesco/elephanta-caves.json';
import csmt from './itineraries/unesco/csmt.json';
import westernGhats from './itineraries/unesco/western-ghats.json';
import artDeco from './itineraries/unesco/art-deco-mumbai.json';
import maratha from './itineraries/unesco/maratha-military-landscapes.json';

const RAW: Record<string, RawItineraryDay[]> = {
  'ajanta-caves': ajanta as RawItineraryDay[],
  'ellora-caves': ellora as RawItineraryDay[],
  'elephanta-caves': elephanta as RawItineraryDay[],
  csmt: csmt as RawItineraryDay[],
  'western-ghats': westernGhats as RawItineraryDay[],
  'art-deco-mumbai': artDeco as RawItineraryDay[],
  'maratha-military-landscapes': maratha as RawItineraryDay[],
};

export function unescoItineraryDays(
  slug: string,
  locationTitle: string,
  gallery: string[],
): Day[] | undefined {
  const raw = RAW[slug];
  if (!raw) return undefined;
  return buildSinglePlaceItineraryDays(raw, locationTitle, gallery);
}
