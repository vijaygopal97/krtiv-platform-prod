import type { Day } from '@/components/krtiv/data';
import { buildSinglePlaceItineraryDays, type RawItineraryDay } from '@/lib/singleDayItinerary';

import ajanta from './itineraries/timeless-icons/ajanta-caves.json';
import ellora from './itineraries/timeless-icons/ellora-caves.json';
import lonar from './itineraries/timeless-icons/lonar-crater.json';
import raigad from './itineraries/timeless-icons/raigad-fort.json';
import kas from './itineraries/timeless-icons/kas-plateau.json';
import daulatabad from './itineraries/timeless-icons/daulatabad-fort.json';
import pagoda from './itineraries/timeless-icons/global-vipassana-pagoda.json';

const RAW: Record<string, RawItineraryDay[]> = {
  'ajanta-caves': ajanta as RawItineraryDay[],
  'ellora-caves': ellora as RawItineraryDay[],
  'lonar-crater': lonar as RawItineraryDay[],
  'raigad-fort': raigad as RawItineraryDay[],
  'kas-plateau': kas as RawItineraryDay[],
  'daulatabad-fort': daulatabad as RawItineraryDay[],
  'global-vipassana-pagoda': pagoda as RawItineraryDay[],
};

export function timelessIconItineraryDays(
  slug: string,
  locationTitle: string,
  gallery: string[],
): Day[] | undefined {
  const raw = RAW[slug];
  if (!raw) return undefined;
  return buildSinglePlaceItineraryDays(raw, locationTitle, gallery);
}
