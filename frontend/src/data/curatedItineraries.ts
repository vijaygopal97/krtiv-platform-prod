import type { PlaceNavItem } from '@/lib/siteNavigation';
import { PLACES_NAV } from '@/lib/siteNavigation';
import {
  getSpotlightsForTrail,
  type CuratedSpotlight,
} from '@/data/curatedSpotlights';
import { getWeekendGetawaySpotlights } from '@/data/weekendGetaways';
import { getMonsoonCategorySpotlights } from '@/data/monsoonTrailCategories';
import { getTimelessIconSpotlights } from '@/data/timelessIcons';
import { getWineTrailSpotlights } from '@/data/wineTrailDestinations';
import {
  getNatureTrailSpotlights,
} from '@/data/curatedExperiences';

export type CuratedTrailSlug =
  | 'unesco'
  | 'seven-wonders'
  | 'weekend-getaways'
  | 'wine-trail'
  | 'nature-trails'
  | 'monsoon-trails';

export type CuratedTrail = {
  slug: CuratedTrailSlug;
  title: string;
  eyebrow: string;
  description: string;
  /** Destination slugs from PLACES_NAV — used for wine trail & wild safari */
  placeSlugs?: string[];
  /** Rich spotlight cards — UNESCO, Timeless Icons, Weekend Getaways, Nature & Monsoon Trails */
  useSpotlights?: boolean;
};

function placesForSlugs(slugs: string[]): PlaceNavItem[] {
  return slugs
    .map((slug) => PLACES_NAV.find((p) => p.slug === slug))
    .filter(Boolean) as PlaceNavItem[];
}

export const CURATED_TRAILS: Record<CuratedTrailSlug, CuratedTrail> = {
  unesco: {
    slug: 'unesco',
    title: 'UNESCO World Heritage Sites',
    eyebrow: 'Curated Itineraries',
    description:
      'Maharashtra is home to seven UNESCO World Heritage Sites — from Ajanta’s painted caves and Ellora’s Kailasa temple to Mumbai’s Gothic and Art Deco skylines, the Sahyadri biodiversity of the Western Ghats, and the Maratha hill-fort landscapes. Explore each inscription below.',
    useSpotlights: true,
  },
  'seven-wonders': {
    slug: 'seven-wonders',
    title: 'Timeless Icons of Maharashtra',
    eyebrow: 'Curated Itineraries',
    description:
      'Chosen in 2013 by MTDC and ABP Majha through public vote and expert jury, these seven timeless icons capture Maharashtra’s geological drama, Maratha valour, and sacred art — each with a full guide, gallery, 3-day itinerary, and AI planner.',
    useSpotlights: true,
  },
  'weekend-getaways': {
    slug: 'weekend-getaways',
    title: 'Weekend Getaways',
    eyebrow: 'Curated Itineraries',
    description:
      'Ten tried-and-tested weekend escapes across Maharashtra — from Mumbai’s seafront energy and Lonavala’s misty ghats to Nashik vineyards, Shirdi’s peaceful pilgrimage, and the Konkan coast at Sindhudurg. Each guide includes a 3-day itinerary, gallery, and AI planner.',
    useSpotlights: true,
  },
  'wine-trail': {
    slug: 'wine-trail',
    title: 'Wine Trail',
    eyebrow: 'Curated Itineraries',
    description:
      'From Nashik’s Godavari valley estates to Pune’s urban cellars, Konkan heritage brews, and boutique vineyard stays — four curated tasting routes across Maharashtra.',
    useSpotlights: true,
  },
  'nature-trails': {
    slug: 'nature-trails',
    title: 'Nature Trails',
    eyebrow: 'Curated Itineraries',
    description:
      'Wildlife safaris, firefly forests, wetland birding, and Sahyadri waterfalls — six curated nature experiences across Maharashtra with full guides, galleries, 3-day itineraries, and AI planning.',
    useSpotlights: true,
  },
  'monsoon-trails': {
    slug: 'monsoon-trails',
    title: 'Monsoon Trails',
    eyebrow: 'Curated Itineraries',
    description:
      'Chase the monsoon through Maharashtra’s most dramatic season — five curated collections covering waterfalls, scenic drives, mist-wrapped forts, cloud-walk hill stations, and one-day treks near Mumbai.',
    useSpotlights: true,
  },
};

export const CURATED_TRAIL_SLUGS = Object.keys(CURATED_TRAILS) as CuratedTrailSlug[];

export function getCuratedTrail(slug: string): CuratedTrail | undefined {
  return CURATED_TRAILS[slug as CuratedTrailSlug];
}

export function getCuratedTrailPlaces(slug: CuratedTrailSlug): PlaceNavItem[] {
  const trail = CURATED_TRAILS[slug];
  if (!trail.placeSlugs?.length) return [];
  return placesForSlugs(trail.placeSlugs);
}

export function getCuratedTrailSpotlights(slug: CuratedTrailSlug): CuratedSpotlight[] {
  if (slug === 'weekend-getaways') return getWeekendGetawaySpotlights();
  if (slug === 'nature-trails') return getNatureTrailSpotlights();
  if (slug === 'monsoon-trails') return getMonsoonCategorySpotlights();
  if (slug === 'wine-trail') return getWineTrailSpotlights();
  if (slug === 'seven-wonders') return getTimelessIconSpotlights();
  if (slug === 'unesco') {
    return getSpotlightsForTrail(slug);
  }
  return [];
}

export function trailUsesSpotlights(slug: CuratedTrailSlug): boolean {
  return Boolean(CURATED_TRAILS[slug].useSpotlights);
}
