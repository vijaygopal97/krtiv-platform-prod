import { getDestination } from '@/data/destinations';
import { resolveDestinationSlug } from '@/lib/destinationRedirects';
import { PLACES_NAV } from '@/lib/siteNavigation';

export type SavedPlaceMeta = {
  slug: string;
  title?: string;
  image?: string;
  locationLabel?: string;
  source?: string;
  lat?: number;
  lng?: number;
};

export function slugFromPlacesHref(href?: string): string | undefined {
  if (!href) return undefined;
  const match = href.match(/\/places-to-go\/([^/?#]+)/);
  if (!match) return undefined;
  return resolveDestinationSlug(match[1]);
}

function labelToSlug(label?: string): string | undefined {
  if (!label) return undefined;
  const lower = label.toLowerCase();
  for (const place of PLACES_NAV) {
    const slugWords = place.slug.replace(/-/g, ' ');
    if (lower.includes(place.label.toLowerCase()) || lower.includes(slugWords)) {
      return place.slug;
    }
  }
  return undefined;
}

/** Resolve a stable save key for any card surface. */
export function resolveSaveSlug(input: {
  slug?: string;
  relatedHref?: string;
  plannerPlaceSlug?: string;
  locationLabel?: string;
  prefix?: 'activity' | 'journey' | 'story' | 'spot';
}): string {
  if (input.plannerPlaceSlug) {
    return resolveDestinationSlug(input.plannerPlaceSlug);
  }
  const fromHref = slugFromPlacesHref(input.relatedHref);
  if (fromHref && getDestination(fromHref)) return fromHref;
  if (input.slug) {
    const canonical = resolveDestinationSlug(input.slug);
    if (getDestination(canonical)) return canonical;
    const fromLabel = labelToSlug(input.locationLabel || input.slug);
    if (fromLabel) return fromLabel;
    const prefix = input.prefix || 'spot';
    return `${prefix}:${input.slug}`;
  }
  const fromLabel = labelToSlug(input.locationLabel);
  if (fromLabel) return fromLabel;
  return `spot:${input.locationLabel || 'unknown'}`;
}

export function isDestinationSlug(slug: string): boolean {
  return Boolean(getDestination(resolveDestinationSlug(slug)));
}

export function displayNameForSlug(slug: string, fallback?: string): string {
  const dest = getDestination(resolveDestinationSlug(slug));
  if (dest?.title) return dest.title;
  if (slug.startsWith('activity:')) return fallback || slug.slice('activity:'.length);
  if (slug.startsWith('journey:')) return fallback || slug.slice('journey:'.length);
  if (slug.startsWith('story:')) return fallback || slug.slice('story:'.length);
  if (slug.startsWith('spot:')) return fallback || slug.slice('spot:'.length).replace(/-/g, ' ');
  if (slug.startsWith('explore:')) return fallback || 'Liked photo';
  return fallback || slug;
}
