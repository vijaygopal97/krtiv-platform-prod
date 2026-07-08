import type { CategoryItinerary } from '@/components/krtiv/data';
import type { CuratedSpotlight } from '@/data/curatedSpotlights';
import { getDestination, type DestinationRecord } from '@/data/destinations';

export const WINE_TRAIL_SLUGS = [
  'nashik',
  'pune',
  'konkan-heritage-brews',
  'boutique-vineyards',
] as const;

export type WineTrailSlug = (typeof WINE_TRAIL_SLUGS)[number];

export type WineTrailRecord = DestinationRecord & {
  slug: WineTrailSlug;
  gallery: string[];
  trailLabel: string;
};

export function wineTrailPath(slug: WineTrailSlug) {
  return `/curated-itineraries/wine-trail/${slug}`;
}

const CUSTOM: Record<
  Exclude<WineTrailSlug, 'nashik' | 'pune'>,
  Omit<WineTrailRecord, 'slug'>
> = {
  'konkan-heritage-brews': {
    title: 'Konkan Heritage Brews',
    subtitle: 'Coastal cashew feni & village stills',
    description:
      'Beyond vineyards, the Konkan coast preserves small-batch cashew feni distillation and seasonal fruit wines — a slower, heritage side of Maharashtra’s drink culture.',
    hero: '/places-to-go/sindhudurg.jpg',
    accent: 'Taste',
    region: 'Ratnagiri · Sindhudurg',
    map: { lat: 16.99, lng: 73.3, zoom: 9 },
    topAttractions: ['Cashew feni tastings', 'Coastal village walks', 'Konkan seafood pairings', 'Heritage still visits'],
    bestTimeToVisit: 'October–February for comfortable coastal travel.',
    localFood: ['Solkadhi', 'Bangda fry', 'Kokum sharbat', 'Fresh coconut'],
    travelTips: [
      'Book tastings through licensed producers only.',
      'Never drink and drive on ghat roads.',
      'Pair coastal drives with early-morning market stops.',
    ],
    nearbyDestinations: [
      { label: 'Sindhudurg', href: '/curated-itineraries/weekend-getaways/sindhudurg' },
      { label: 'Wine Trail home', href: '/curated-itineraries/wine-trail' },
    ],
    days: [],
    gallery: ['/places-to-go/sindhudurg.jpg', '/categories/culinary/home-1.jpg'],
    trailLabel: 'Konkan heritage',
  },
  'boutique-vineyards': {
    title: 'Boutique Vineyards',
    subtitle: 'Small-lot wines & estate stays',
    description:
      'Family-run estates across Nashik and Pune districts craft limited releases — cellar tours, harvest weekends, and vineyard stays without the big-resort crowds.',
    hero: '/places-to-go/nashik.jpg',
    accent: 'Sip',
    region: 'Nashik · Pune districts',
    map: { lat: 19.97, lng: 73.79, zoom: 10 },
    topAttractions: ['Estate tastings', 'Harvest experiences', 'Vineyard stays', 'Sommelier-led pairings'],
    bestTimeToVisit: 'November–February for harvest and pleasant weather.',
    localFood: ['Farm-to-table lunches', 'Cheese boards', 'Maharashtrian thali on route'],
    travelTips: [
      'Reserve tastings 24–48 hours ahead on weekends.',
      'Designate a driver or book a local cab between estates.',
      'Combine with a Nashik or Pune overnight.',
    ],
    nearbyDestinations: [
      { label: 'Nashik wine country', href: wineTrailPath('nashik') },
      { label: 'Pune cellar circuit', href: wineTrailPath('pune') },
    ],
    days: [],
    gallery: ['/places-to-go/nashik.jpg', '/places-to-go/pune.jpg'],
    trailLabel: 'Boutique estates',
  },
};

function buildFromPlace(slug: 'nashik' | 'pune'): WineTrailRecord | undefined {
  const dest = getDestination(slug);
  if (!dest) return undefined;
  const gallery = [dest.hero, `/places-to-go/${slug}.jpg`].filter(Boolean);
  return {
    ...dest,
    slug,
    hero: gallery[0] ?? dest.hero,
    gallery,
    trailLabel: slug === 'nashik' ? 'Wine capital' : 'Urban cellar circuit',
    subtitle: slug === 'nashik' ? 'Godavari valley vineyards' : 'Heritage & emerging wine routes',
    description:
      slug === 'nashik'
        ? 'India’s wine capital along the Godavari — estate tastings, harvest festivals, and sacred ghats in one leisurely circuit.'
        : 'Pune’s growing wine scene pairs Maratha heritage with boutique estates and easy weekend drives from the city.',
  };
}

const BUILT: WineTrailRecord[] = [
  buildFromPlace('nashik'),
  buildFromPlace('pune'),
  { slug: 'konkan-heritage-brews', ...CUSTOM['konkan-heritage-brews'] },
  { slug: 'boutique-vineyards', ...CUSTOM['boutique-vineyards'] },
].filter(Boolean) as WineTrailRecord[];

const BY_SLUG = new Map(BUILT.map((w) => [w.slug, w]));

export function getWineTrailDestination(slug: string): WineTrailRecord | undefined {
  return BY_SLUG.get(slug as WineTrailSlug);
}

export function allWineTrailSlugs(): WineTrailSlug[] {
  return [...WINE_TRAIL_SLUGS];
}

export function wineTrailAsItinerary(site: WineTrailRecord): CategoryItinerary {
  return {
    slug: site.slug,
    title: site.title,
    subtitle: site.subtitle,
    description: site.description,
    hero: site.hero,
    accent: site.accent,
    region: site.region,
    days: site.days,
  };
}

export function getWineTrailSpotlights(): CuratedSpotlight[] {
  return BUILT.map((site) => ({
    slug: site.slug,
    title: site.title,
    location: site.trailLabel,
    image: site.hero,
    badge: 'Wine Trail',
    summary: site.description.split('.')[0] + '.',
    body: site.description,
    highlights: site.topAttractions.slice(0, 3),
    relatedHref: wineTrailPath(site.slug),
    relatedLabel: `Explore ${site.title}`,
    cardHref: wineTrailPath(site.slug),
  }));
}
