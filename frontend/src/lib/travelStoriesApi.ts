import type { TravelStoryDestination } from '@/types/travelStory';

let cache: TravelStoryDestination[] | null = null;

/** Travel stories are static CMS data — load locally (nginx proxies /api/* to the Node backend). */
export async function fetchTravelStories(): Promise<TravelStoryDestination[]> {
  if (cache) return cache;
  const { getTravelStories } = await import('@/data/travelStories');
  cache = getTravelStories();
  return cache;
}

const preloadedImages = new Set<string>();

export function preloadTravelStoryImage(src: string) {
  if (typeof window === 'undefined' || !src || preloadedImages.has(src)) return;
  preloadedImages.add(src);
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
}
