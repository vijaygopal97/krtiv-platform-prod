import type { DestinationGalleryImage } from '@/lib/destinationGalleryTypes';
import {
  getDestinationImages,
  searchKeywordForDestination,
} from '@/data/destinationImages';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MIN_API_IMAGES = 8;
const MAX_IMAGES = 12;

type CacheEntry = { images: DestinationGalleryImage[]; expires: number };

/** Cache keyed strictly by destination slug — never shared across slugs. */
const memoryCache = new Map<string, CacheEntry>();

function dedupeByUrl(images: DestinationGalleryImage[]): DestinationGalleryImage[] {
  const seen = new Set<string>();
  const out: DestinationGalleryImage[] = [];
  for (const img of images) {
    if (!img.full || seen.has(img.full)) continue;
    seen.add(img.full);
    out.push(img);
  }
  return out;
}

async function searchUnsplash(query: string, slug: string, limit: number): Promise<DestinationGalleryImage[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];
  try {
    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.set('query', query);
    url.searchParams.set('per_page', String(Math.min(limit, 12)));
    url.searchParams.set('orientation', 'landscape');
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${key}` },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      results?: Array<{
        id: string;
        alt_description?: string | null;
        description?: string | null;
        urls?: { regular?: string; small?: string };
        user?: { name?: string };
      }>;
    };
    return (data.results ?? [])
      .map((photo, i) => ({
        id: `${slug}-unsplash-${photo.id || i}`,
        alt: photo.alt_description || photo.description || `${query} — ${i + 1}`,
        full: photo.urls?.regular ?? '',
        thumb: photo.urls?.small ?? photo.urls?.regular ?? '',
        credit: photo.user?.name ? `Unsplash / ${photo.user.name}` : 'Unsplash',
      }))
      .filter((p) => p.full && p.thumb);
  } catch {
    return [];
  }
}

async function searchPexels(query: string, slug: string, limit: number): Promise<DestinationGalleryImage[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  try {
    const url = new URL('https://api.pexels.com/v1/search');
    url.searchParams.set('query', query);
    url.searchParams.set('per_page', String(Math.min(limit, 12)));
    url.searchParams.set('orientation', 'landscape');
    const res = await fetch(url.toString(), {
      headers: { Authorization: key },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      photos?: Array<{
        id: number;
        alt?: string;
        src?: { large2x?: string; large?: string; medium?: string };
        photographer?: string;
      }>;
    };
    return (data.photos ?? [])
      .map((photo, i) => ({
        id: `${slug}-pexels-${photo.id || i}`,
        alt: photo.alt || `${query} — ${i + 1}`,
        full: photo.src?.large2x ?? photo.src?.large ?? '',
        thumb: photo.src?.medium ?? photo.src?.large ?? '',
        credit: photo.photographer ? `Pexels / ${photo.photographer}` : 'Pexels',
      }))
      .filter((p) => p.full && p.thumb);
  } catch {
    return [];
  }
}

async function searchPixabay(query: string, slug: string, limit: number): Promise<DestinationGalleryImage[]> {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return [];
  try {
    const url = new URL('https://pixabay.com/api/');
    url.searchParams.set('key', key);
    url.searchParams.set('q', query);
    url.searchParams.set('image_type', 'photo');
    url.searchParams.set('orientation', 'horizontal');
    url.searchParams.set('per_page', String(Math.min(limit, 12)));
    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      hits?: Array<{
        id: number;
        tags?: string;
        largeImageURL?: string;
        webformatURL?: string;
        user?: string;
      }>;
    };
    return (data.hits ?? [])
      .map((hit, i) => ({
        id: `${slug}-pixabay-${hit.id || i}`,
        alt: hit.tags?.split(',')[0]?.trim() || `${query} — ${i + 1}`,
        full: hit.largeImageURL ?? '',
        thumb: hit.webformatURL ?? hit.largeImageURL ?? '',
        credit: hit.user ? `Pixabay / ${hit.user}` : 'Pixabay',
      }))
      .filter((p) => p.full && p.thumb);
  } catch {
    return [];
  }
}

async function fetchFromApis(slug: string): Promise<DestinationGalleryImage[]> {
  const query = searchKeywordForDestination(slug);
  const fromUnsplash = await searchUnsplash(query, slug, MAX_IMAGES);
  if (fromUnsplash.length >= MIN_API_IMAGES) return fromUnsplash.slice(0, MAX_IMAGES);
  const fromPexels = await searchPexels(query, slug, MAX_IMAGES);
  const combined = dedupeByUrl([...fromUnsplash, ...fromPexels]);
  if (combined.length >= MIN_API_IMAGES) return combined.slice(0, MAX_IMAGES);
  const fromPixabay = await searchPixabay(query, slug, MAX_IMAGES);
  return dedupeByUrl([...combined, ...fromPixabay]).slice(0, MAX_IMAGES);
}

/**
 * Returns images for one slug only. Never mixes another destination's gallery.
 */
export async function resolveDestinationGallery(slug: string): Promise<DestinationGalleryImage[]> {
  const fallback = getDestinationImages(slug);
  if (!fallback.length) return [];

  const hit = memoryCache.get(slug);
  if (hit && hit.expires > Date.now()) return hit.images;

  let apiImages: DestinationGalleryImage[] = [];
  try {
    apiImages = await fetchFromApis(slug);
  } catch {
    apiImages = [];
  }

  let final: DestinationGalleryImage[];
  if (apiImages.length >= MIN_API_IMAGES) {
    final = apiImages;
  } else if (apiImages.length > 0) {
    final = dedupeByUrl([...apiImages, ...fallback]).slice(0, MAX_IMAGES);
  } else {
    final = fallback.slice(0, MAX_IMAGES);
  }

  memoryCache.set(slug, { images: final, expires: Date.now() + CACHE_TTL_MS });
  return final;
}
