import type { Day } from '@/components/krtiv/data';
import { buildSinglePlaceItineraryDays, type RawItineraryDay } from '@/lib/singleDayItinerary';

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

const RAW: Record<string, RawItineraryDay[]> = {
  mumbai: mumbai as RawItineraryDay[],
  pune: pune as RawItineraryDay[],
  nashik: nashik as RawItineraryDay[],
  'ajanta-ellora': ajantaEllora as RawItineraryDay[],
  shirdi: shirdi as RawItineraryDay[],
  mahabaleshwar: mahabaleshwar as RawItineraryDay[],
  lonavala: lonavala as RawItineraryDay[],
  alibaug: alibaug as RawItineraryDay[],
  kolhapur: kolhapur as RawItineraryDay[],
  nagpur: nagpur as RawItineraryDay[],
  sindhudurg: sindhudurg as RawItineraryDay[],
  chandrapur: chandrapur as RawItineraryDay[],
};

/** Client-approved 1-day itineraries for Places to Go destinations. */
export function approvedItineraryDays(
  slug: string,
  locationTitle: string,
  heroImage: string
): Day[] | undefined {
  const raw = RAW[slug];
  if (!raw) return undefined;
  return buildSinglePlaceItineraryDays(raw, locationTitle, heroImage);
}

export const APPROVED_ITINERARY_SLUGS = Object.keys(RAW);
