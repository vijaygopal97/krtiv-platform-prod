export const JOURNEY_SLUGS = [
  'kalsubai-sunrise',
  'kohinoor-of-the-deccan',
  'konkan-slow-lunch',
] as const;

export type JourneySlug = (typeof JOURNEY_SLUGS)[number];

export type JourneyHighlight = { icon?: string; label: string; detail?: string };
export type JourneyExperience = { icon?: string; label: string; detail?: string };
export type JourneyStorySection = { heading: string; paragraphs: string[] };
export type JourneyItineraryStep = { time: string; title: string; description?: string };
export type JourneyNearby = { slug: string; title: string; image?: string; region?: string };
export type JourneyTravelInfo = {
  location?: string;
  nearestAirport?: string;
  nearestRailway?: string;
  roadConnectivity?: string;
  entryFees?: string;
  timings?: string;
  duration?: string;
  difficulty?: string;
  bestSeason?: string;
  idealFor?: string;
};
export type JourneyMap = { lat?: number; lng?: number; query?: string };
export type JourneySeo = {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
};

export type JourneyRecord = {
  slug: string;
  title: string;
  subtitle?: string;
  location?: string;
  category?: string;
  readingTime?: string;
  shortDescription?: string;
  heroImage?: string;
  region?: string;
  blurb?: string;
  cardLayout?: 'featured' | 'compact';
  sortOrder?: number;
  story?: string;
  storySections?: JourneyStorySection[];
  highlights?: JourneyHighlight[];
  gallery?: string[];
  experiences?: JourneyExperience[];
  itinerary?: JourneyItineraryStep[];
  travelInfo?: JourneyTravelInfo;
  localFood?: string[];
  travelTips?: string[];
  nearby?: JourneyNearby[];
  map?: JourneyMap;
  seo?: JourneySeo;
};

export type JourneyCard = Pick<
  JourneyRecord,
  'slug' | 'title' | 'region' | 'heroImage' | 'blurb' | 'cardLayout' | 'sortOrder'
> & { image?: string };

export function journeyPath(slug: string) {
  return `/journeys/${slug}`;
}
