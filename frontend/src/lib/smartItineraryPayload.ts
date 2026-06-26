import type { ItineraryJobRequest } from '@/lib/signpostApi';
import { getCategoryApiName } from '@/lib/signpostApi';

const INTEREST_TO_CATEGORY: Record<string, string> = {
  Heritage: 'Historical & Heritage',
  Pilgrimage: 'Spiritual & Pilgrimage',
  Adventure: 'Adventure & Ecotourism',
  Culinary: 'Culinary & Rural',
  'Art, Craft & Culture': 'Art, Craft & Culture',
  'Urban & Contemporary': 'Urban & Contemporary',
  Weddings: 'Weddings',
};

export function buildSmartItineraryJobRequest(opts: {
  keywords: string[];
  context: 'home' | string;
  durationDays?: string;
  originCity?: string;
  travelWith?: string;
  tripName?: string;
  exploreInterests?: string[];
}): ItineraryJobRequest {
  const {
    keywords,
    context,
    durationDays = '4',
    originCity = 'Mumbai',
    travelWith = 'Family',
    tripName,
    exploreInterests = [],
  } = opts;

  const mappedFromExplore = exploreInterests
    .map((i) => INTEREST_TO_CATEGORY[i])
    .filter(Boolean);

  const categoryFocus =
    context === 'explore'
      ? 'Explore Maharashtra'
      : context === 'home'
        ? 'Maharashtra Tourism'
        : getCategoryApiName(context) || 'Maharashtra Tourism';

  const interestCategory =
    mappedFromExplore.length > 0
      ? mappedFromExplore
      : context === 'home' || context === 'explore'
        ? keywords.length
          ? keywords.map((k) => INTEREST_TO_CATEGORY[k] ?? k).filter(Boolean)
          : ['Historical & Heritage', 'Adventure & Ecotourism', 'Culinary & Rural']
        : categoryFocus
          ? [categoryFocus]
          : ['Historical & Heritage'];

  const tourismKeywords = [
    ...new Set([
      ...keywords,
      ...exploreInterests,
      `Travel group: ${travelWith}`,
      `Duration: ${durationDays} days`,
      tripName ? `Trip name: ${tripName}` : '',
    ].filter(Boolean)),
  ];

  const title =
    tripName?.trim() ||
    (keywords.length > 0
      ? `Maharashtra: ${keywords.slice(0, 3).join(', ')}`
      : 'My Smart Maharashtra Itinerary');

  return {
    title,
    userProfile: {
      age: '30',
      interestCategory,
      travelWith,
      originCity,
      durationDays,
      preferredLocations: [],
      tourismKeywords,
      categoryFocus: mappedFromExplore[0] ?? categoryFocus,
    },
  };
}
