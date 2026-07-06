import type { CategoryItinerary } from '@/components/krtiv/data';
import type { CuratedSpotlight } from '@/data/curatedSpotlights';
import { getDestination, type DestinationRecord } from '@/data/destinations';
import { getDestinationHeroSlides } from '@/data/destinationHeroImages';

export const WEEKEND_GETAWAY_SLUGS = [
  'mumbai',
  'pune',
  'nashik',
  'shirdi',
  'mahabaleshwar',
  'lonavala',
  'alibaug',
  'kolhapur',
  'nagpur',
  'sindhudurg',
] as const;

export type WeekendGetawaySlug = (typeof WEEKEND_GETAWAY_SLUGS)[number];

const WEEKEND_SLUG_SET = new Set<string>(WEEKEND_GETAWAY_SLUGS);

/** Short trip-type label shown in hero eyebrow */
const TRIP_LABEL: Record<WeekendGetawaySlug, string> = {
  mumbai: 'City break',
  pune: 'Culture & cafés',
  nashik: 'Wine & ghats',
  shirdi: 'Pilgrimage retreat',
  mahabaleshwar: 'Hill station',
  lonavala: 'Hill escape',
  alibaug: 'Coastal weekend',
  kolhapur: 'Heritage & spice',
  nagpur: 'Central hub',
  sindhudurg: 'Konkan coast',
};

export type WeekendGetawayRecord = DestinationRecord & {
  slug: WeekendGetawaySlug;
  gallery: string[];
  tripLabel: string;
};

export function weekendGetawayPath(slug: WeekendGetawaySlug) {
  return `/curated-itineraries/weekend-getaways/${slug}`;
}

function galleryFor(slug: WeekendGetawaySlug): string[] {
  const slides = getDestinationHeroSlides(slug);
  const urls = slides.map((s) => s.imageUrl).filter(Boolean);
  if (urls.length >= 3) return urls.slice(0, 4);
  const dest = getDestination(slug);
  return dest?.hero ? [dest.hero, ...urls] : urls;
}

function remapNearby(dest: DestinationRecord): { label: string; href: string }[] {
  return dest.nearbyDestinations.map((n) => {
    const match = n.href.match(/\/places-to-go\/([^/]+)/);
    const nearSlug = match?.[1];
    if (nearSlug && WEEKEND_SLUG_SET.has(nearSlug)) {
      return { label: n.label, href: weekendGetawayPath(nearSlug as WeekendGetawaySlug) };
    }
    return n;
  });
}

function build(slug: WeekendGetawaySlug): WeekendGetawayRecord | undefined {
  const dest = getDestination(slug);
  if (!dest) return undefined;
  const gallery = galleryFor(slug);
  return {
    ...dest,
    slug,
    hero: gallery[0] ?? dest.hero,
    gallery,
    tripLabel: TRIP_LABEL[slug],
    nearbyDestinations: remapNearby(dest),
  };
}

export const WEEKEND_GETAWAYS: WeekendGetawayRecord[] = WEEKEND_GETAWAY_SLUGS.map((slug) => build(slug)).filter(
  Boolean,
) as WeekendGetawayRecord[];

export function getWeekendGetaway(slug: string): WeekendGetawayRecord | undefined {
  if (!WEEKEND_SLUG_SET.has(slug)) return undefined;
  return WEEKEND_GETAWAYS.find((g) => g.slug === slug);
}

export function allWeekendGetawaySlugs(): WeekendGetawaySlug[] {
  return [...WEEKEND_GETAWAY_SLUGS];
}

export function weekendGetawayAsItinerary(site: WeekendGetawayRecord): CategoryItinerary {
  const dayImages = site.gallery.length ? site.gallery : [site.hero];
  return {
    slug: site.slug,
    title: site.title,
    subtitle: site.subtitle,
    description: site.description,
    hero: site.hero,
    accent: site.accent,
    region: site.region,
    days: site.days.map((d, i) => ({
      ...d,
      image: dayImages[i % dayImages.length] ?? site.hero,
    })),
  };
}

export function getWeekendGetawaySpotlights(): CuratedSpotlight[] {
  return WEEKEND_GETAWAYS.map((g) => ({
    slug: g.slug,
    title: g.title,
    location: g.subtitle,
    image: g.hero,
    badge: `Weekend · ${g.tripLabel}`,
    summary: g.description,
    body: g.description,
    highlights: g.topAttractions.slice(0, 3),
    relatedHref: weekendGetawayPath(g.slug),
    relatedLabel: `Plan your ${g.title} weekend`,
  }));
}
