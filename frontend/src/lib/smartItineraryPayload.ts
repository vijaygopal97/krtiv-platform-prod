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

/** Chip label → API interest category for itinerary generation. */
const KEYWORD_TO_CATEGORY: Record<string, string> = {
  // Home / statewide
  'Heritage & forts': 'Historical & Heritage',
  'Beaches & coast': 'Adventure & Ecotourism',
  'Temples & ghats': 'Spiritual & Pilgrimage',
  'Wildlife & forests': 'Adventure & Ecotourism',
  'Hill stations': 'Adventure & Ecotourism',
  'Street food': 'Culinary & Rural',
  'Weekend escapes': 'Maharashtra Tourism',
  'Hidden gems': 'Maharashtra Tourism',

  // Historical
  'Maratha forts': 'Historical & Heritage',
  'UNESCO caves': 'Historical & Heritage',
  'Heritage walks': 'Historical & Heritage',
  'Ancient temples': 'Spiritual & Pilgrimage',
  'Royal palaces': 'Historical & Heritage',
  'Museum days': 'Historical & Heritage',

  // Adventure
  'Sahyadri treks': 'Adventure & Ecotourism',
  'Monsoon waterfalls': 'Adventure & Ecotourism',
  'Jungle safari': 'Adventure & Ecotourism',
  'Camping nights': 'Adventure & Ecotourism',
  'Coastal kayaking': 'Adventure & Ecotourism',
  'Hill escapes': 'Adventure & Ecotourism',

  // Spiritual
  'Jyotirlinga darshan': 'Spiritual & Pilgrimage',
  'Pilgrimage circuits': 'Spiritual & Pilgrimage',
  'Temple mornings': 'Spiritual & Pilgrimage',
  'Sacred river ghats': 'Spiritual & Pilgrimage',
  'Ashram stays': 'Spiritual & Pilgrimage',
  'Festival season': 'Art, Craft & Culture',

  // Culinary
  'Street food trails': 'Culinary & Rural',
  'Konkan seafood': 'Culinary & Rural',
  'Misal & vada pav': 'Culinary & Rural',
  'Vineyard lunches': 'Culinary & Rural',
  'Farm-to-table': 'Culinary & Rural',
  'Maharashtrian thali': 'Culinary & Rural',

  // Art & culture
  'Folk dance & music': 'Art, Craft & Culture',
  'Warli & handicrafts': 'Art, Craft & Culture',
  'Festival nights': 'Art, Craft & Culture',
  'Village performances': 'Art, Craft & Culture',
  'Art galleries': 'Art, Craft & Culture',
  'Paithani & weaving': 'Art, Craft & Culture',

  // Urban
  'Marine Drive evenings': 'Urban & Contemporary',
  'Cafe hopping': 'Urban & Contemporary',
  'Street markets': 'Urban & Contemporary',
  'Art deco walks': 'Urban & Contemporary',
  'Night markets': 'Urban & Contemporary',
  'City food crawls': 'Culinary & Rural',

  // Weddings
  'Palace venues': 'Weddings',
  'Beach ceremonies': 'Weddings',
  'Vineyard weddings': 'Weddings',
  'Pre-wedding shoots': 'Weddings',
  'Honeymoon escapes': 'Weddings',
  'Luxury resorts': 'Weddings',

  // Places — Mumbai
  'Gateway & Elephanta': 'Historical & Heritage',
  'Marine Drive sunsets': 'Urban & Contemporary',
  'Street food crawl': 'Culinary & Rural',
  'Art deco Mumbai': 'Urban & Contemporary',
  'Colaba heritage': 'Historical & Heritage',
  'Coastal day trips': 'Adventure & Ecotourism',

  // Places — Pune
  'Shaniwar Wada': 'Historical & Heritage',
  'Sinhagad fort trek': 'Adventure & Ecotourism',
  'Cafe & food scene': 'Urban & Contemporary',
  'Aga Khan Palace': 'Historical & Heritage',
  'Hill station hops': 'Adventure & Ecotourism',
  'Heritage lanes': 'Historical & Heritage',

  // Places — Nashik
  'Sula & vineyards': 'Culinary & Rural',
  'Trimbakeshwar darshan': 'Spiritual & Pilgrimage',
  'Wine tasting': 'Culinary & Rural',
  'Godavari ghats': 'Spiritual & Pilgrimage',
  'Grape country drives': 'Culinary & Rural',
  'Spiritual mornings': 'Spiritual & Pilgrimage',

  // Places — Ajanta & Ellora
  'Ajanta murals': 'Historical & Heritage',
  'Kailasa temple': 'Historical & Heritage',
  'Ellora caves': 'Historical & Heritage',
  'Heritage photography': 'Art, Craft & Culture',
  'Cave day trips': 'Historical & Heritage',
  'Aurangabad flavours': 'Culinary & Rural',

  // Places — Shirdi
  'Sai Baba darshan': 'Spiritual & Pilgrimage',
  'Peaceful pilgrimage': 'Spiritual & Pilgrimage',
  'Prasadalaya meals': 'Culinary & Rural',
  'Nearby shrines': 'Spiritual & Pilgrimage',
  'Family devotion': 'Spiritual & Pilgrimage',

  // Places — Mahabaleshwar
  'Strawberry farms': 'Culinary & Rural',
  'Venna Lake': 'Adventure & Ecotourism',
  'Viewpoint sunsets': 'Adventure & Ecotourism',
  'Monsoon mist': 'Adventure & Ecotourism',
  'Mapro treats': 'Culinary & Rural',
  'Forest walks': 'Adventure & Ecotourism',

  // Places — Lonavala
  'Fort viewpoints': 'Historical & Heritage',
  'Misty valleys': 'Adventure & Ecotourism',
  'Chikki & snacks': 'Culinary & Rural',
  'Weekend escape': 'Maharashtra Tourism',
  'Karla & Bhaja caves': 'Historical & Heritage',

  // Places — Alibaug
  'Beach afternoons': 'Adventure & Ecotourism',
  'Kolaba fort tide walk': 'Historical & Heritage',
  'Seafood thali': 'Culinary & Rural',
  'Ferry from Mumbai': 'Urban & Contemporary',
  'Coastal drives': 'Adventure & Ecotourism',
  'Slow Konkan pace': 'Culinary & Rural',

  // Places — Kolhapur
  'Mahalaxmi temple': 'Spiritual & Pilgrimage',
  'Misal & tambda': 'Culinary & Rural',
  'Royal palace history': 'Historical & Heritage',
  'Rankala evenings': 'Urban & Contemporary',
  'Paithani shopping': 'Art, Craft & Culture',
  'Wrestling tradition': 'Art, Craft & Culture',

  // Places — Nagpur
  Deekshabhoomi: 'Spiritual & Pilgrimage',
  'Orange country': 'Culinary & Rural',
  'Lake sunsets': 'Urban & Contemporary',
  'Saoji spice': 'Culinary & Rural',
  'Wildlife day trips': 'Adventure & Ecotourism',
  'City heritage': 'Historical & Heritage',

  // Places — Sindhudurg
  'Tarkarli beaches': 'Adventure & Ecotourism',
  'Scuba & snorkel': 'Adventure & Ecotourism',
  'Malvan seafood': 'Culinary & Rural',
  'Coastal forts': 'Historical & Heritage',
  'Houseboat stays': 'Adventure & Ecotourism',
  'Konkan villages': 'Culinary & Rural',

  // Places — Chandrapur
  'Tadoba safari': 'Adventure & Ecotourism',
  'Tiger tracking': 'Adventure & Ecotourism',
  'Forest lodges': 'Adventure & Ecotourism',
  'Birding trails': 'Adventure & Ecotourism',
  'Jungle dawn drives': 'Adventure & Ecotourism',
  'Wildlife photography': 'Art, Craft & Culture',
};

function resolveInterestCategories(
  keywords: string[],
  context: string,
  mappedFromExplore: string[]
): string[] {
  if (mappedFromExplore.length > 0) return [...new Set(mappedFromExplore)];

  const categoryFromPage = context !== 'home' && context !== 'explore' ? getCategoryApiName(context) : '';
  if (categoryFromPage) return [categoryFromPage];

  if (keywords.length > 0) {
    const mapped = keywords
      .map((k) => KEYWORD_TO_CATEGORY[k] ?? INTEREST_TO_CATEGORY[k])
      .filter(Boolean);
    if (mapped.length > 0) return [...new Set(mapped)];
  }

  return ['Maharashtra Tourism'];
}

function resolveCategoryFocus(
  context: string,
  interestCategory: string[],
  mappedFromExplore: string[],
  placeTitle?: string,
): string {
  if (placeTitle) return `${placeTitle}, Maharashtra`;
  if (mappedFromExplore[0]) return mappedFromExplore[0];
  if (context !== 'home' && context !== 'explore') {
    return getCategoryApiName(context) || interestCategory[0] || 'Maharashtra Tourism';
  }
  return interestCategory[0] || 'Maharashtra Tourism';
}

export function buildSmartItineraryJobRequest(opts: {
  keywords: string[];
  context: 'home' | string;
  durationDays?: string;
  originCity?: string;
  travelWith?: string;
  tripName?: string;
  exploreInterests?: string[];
  placeSlug?: string;
  placeTitle?: string;
}): ItineraryJobRequest {
  const {
    keywords,
    context,
    durationDays = '4',
    originCity = 'Mumbai',
    travelWith = 'Family',
    tripName,
    exploreInterests = [],
    placeTitle,
  } = opts;

  const mappedFromExplore = exploreInterests
    .map((i) => INTEREST_TO_CATEGORY[i])
    .filter(Boolean);

  const interestCategory = resolveInterestCategories(keywords, context, mappedFromExplore);
  const categoryFocus = resolveCategoryFocus(context, interestCategory, mappedFromExplore, placeTitle);

  const tourismKeywords = [
    ...new Set(
      [
        ...keywords,
        ...exploreInterests,
        placeTitle ? `Base destination: ${placeTitle}` : '',
        categoryFocus ? `Primary theme: ${categoryFocus}` : '',
        `Travel group: ${travelWith}`,
        `Duration: ${durationDays} days`,
        tripName ? `Trip name: ${tripName}` : '',
      ].filter(Boolean)
    ),
  ];

  const title =
    tripName?.trim() ||
    (placeTitle && keywords.length > 0
      ? `${placeTitle}: ${keywords.slice(0, 2).join(', ')}`
      : keywords.length > 0
        ? `Maharashtra: ${keywords.slice(0, 3).join(', ')}`
        : placeTitle
          ? `${placeTitle} itinerary`
          : 'My Smart Maharashtra Itinerary');

  return {
    title,
    userProfile: {
      age: '30',
      interestCategory,
      travelWith,
      originCity: placeTitle || originCity,
      durationDays,
      preferredLocations: placeTitle ? [placeTitle] : [],
      tourismKeywords,
      categoryFocus,
    },
  };
}
