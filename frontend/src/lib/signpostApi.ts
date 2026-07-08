/**
 * Category video and itinerary: all requests go through our backend only.
 * No eflag.in URLs or API keys are used in the frontend.
 */

import { getApiBase, assetPath } from '@/lib/basePath';

function getBackendApiBase(): string {
  if (typeof window !== 'undefined') return getApiBase();
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api';
}

export const CATEGORY_SLUG_TO_API_NAME: Record<string, string> = {
  historical: 'Historical & Heritage',
  spiritual: 'Spiritual & Pilgrimage',
  adventure: 'Adventure & Ecotourism',
  culinary: 'Culinary & Rural',
  'art-culture': 'Art, Craft & Culture',
  urban: 'Urban & Contemporary',
  weddings: 'Weddings',
};

/** Category slug to thumbnail image path. */
export const CATEGORY_SLUG_TO_IMAGE: Record<string, string> = {
  historical: assetPath('/categories/historical-heritage.jpg'),
  spiritual: assetPath('/categories/spiritual-pilgrimage.jpg'),
  adventure: assetPath('/categories/adventure-ecotourism.jpg'),
  culinary: assetPath('/categories/culinary-rural.jpg'),
  'art-culture': assetPath('/categories/art-craft-culture.jpg'),
  urban: assetPath('/categories/urban-contemporary.jpg'),
  weddings: assetPath('/categories/weddings.jpg'),
};

export interface VideoEngagementSummary {
  views: number;
  impressions: number;
  likes: number;
  dislikes: number;
  avgRetention: number | null;
  watchSecondsTotal: number;
}

/** Defaults when SignPost returns no metrics row yet (older proxies may omit `engagement`). */
export const EMPTY_VIDEO_ENGAGEMENT: VideoEngagementSummary = {
  views: 0,
  impressions: 0,
  likes: 0,
  dislikes: 0,
  avgRetention: null,
  watchSecondsTotal: 0,
};

export interface BestVideoResponse {
  threadId: string;
  threadTitle: string;
  category: string;
  language: string;
  url: string;
  rating: number;
  /** Relative path under SignPost uploads (for engagement API). */
  videoPath?: string;
  engagement?: VideoEngagementSummary;
}

export interface BestItineraryResponse {
  source: 'thread' | 'itinerary';
  id: string;
  title: string;
  category: string;
  itinerary: string;
  rating: number;
}

async function fetchBackend<T>(path: string): Promise<T | null> {
  try {
    const base = getBackendApiBase();
    const url = `${base.replace(/\/$/, '')}${path}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      console.error('Backend signpost', path, res.status, err);
      return null;
    }
    const data = await res.json().catch(() => null);
    return data as T | null;
  } catch (err) {
    console.error('Backend signpost fetch error', path, err);
    return null;
  }
}

export function getCategoryApiName(slug: string): string | null {
  return CATEGORY_SLUG_TO_API_NAME[slug] ?? null;
}

/**
 * Best video + engagement must be fresh every request (no Next Data Cache).
 * Otherwise view counts and ranking inputs look wrong after refresh.
 */
async function fetchBestVideoNoStore<T>(path: string): Promise<T | null> {
  try {
    const base = getBackendApiBase();
    const url = `${base.replace(/\/$/, '')}${path}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      console.error('Backend signpost', path, res.status, err);
      return null;
    }
    const data = await res.json().catch(() => null);
    return data as T | null;
  } catch (err) {
    console.error('Backend signpost fetch error', path, err);
    return null;
  }
}

export async function getBestVideo(
  categoryName: string,
  language = 'en'
): Promise<BestVideoResponse | null> {
  const params = new URLSearchParams({
    category: categoryName,
    language,
  });
  return fetchBestVideoNoStore<BestVideoResponse>(`/signpost/best-video?${params}`);
}

export async function getBestItinerary(
  categoryName: string
): Promise<BestItineraryResponse | null> {
  const params = new URLSearchParams({ category: categoryName });
  return fetchBackend<BestItineraryResponse>(`/signpost/best-itinerary?${params}`);
}

/** Request body for starting an itinerary job (API shape). */
export interface ItineraryJobRequest {
  title?: string;
  userProfile: {
    age: string;
    interestCategory: string[];
    travelWith: string;
    originCity: string;
    durationDays: string;
    travelSeason?: string;
    preferredLocations: string[];
    tourismKeywords?: string[];
    categoryFocus?: string;
  };
}

/** Response when starting an itinerary job (202). */
export interface ItineraryJobStartResponse {
  jobId: string;
  status: string;
  message: string;
}

/** Poll job status/result (video or itinerary). */
export interface JobPollResponse {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  type?: 'itinerary';
  threadId?: string;
  itineraryId?: string;
  result?: {
    itinerary?: string;
    itineraryId?: string;
    title?: string;
    videos?: Array<{ language: string; url: string }>;
  };
  error?: string;
}

async function fetchBackendJson<T>(
  path: string,
  options: { method?: string; body?: string } = {}
): Promise<T | null> {
  try {
    const base = getBackendApiBase();
    const url = `${base.replace(/\/$/, '')}${path}`;
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: options.body,
    });
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      console.error('Backend signpost', path, res.status, err);
      return null;
    }
    const data = await res.json().catch(() => null);
    return data as T | null;
  } catch (err) {
    console.error('Backend signpost fetch error', path, err);
    return null;
  }
}

/** Start itinerary-only generation (uses 1 credit). Returns jobId or null. */
export async function startItineraryJob(
  payload: ItineraryJobRequest
): Promise<ItineraryJobStartResponse | null> {
  return fetchBackendJson<ItineraryJobStartResponse>('/signpost/itinerary-jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Poll job status/result. Use for both video and itinerary jobs. */
export async function pollJob(jobId: string): Promise<JobPollResponse | null> {
  return fetchBackendJson<JobPollResponse>(`/signpost/jobs/${encodeURIComponent(jobId)}`);
}

export type VideoEngagementEvent =
  | 'impression'
  | 'view'
  | 'heartbeat'
  | 'like'
  | 'unlike'
  | 'dislike'
  | 'undislike';

/** Client-only POST (no Next cache). Used for category video analytics. */
export async function postVideoEngagement(
  threadId: string,
  body: {
    videoPath: string;
    category: string;
    languageKey?: string;
    event: VideoEngagementEvent;
    deltaWatchSec?: number;
    durationSec?: number;
    feedback?: string;
  }
): Promise<{ ok: boolean; engagement?: VideoEngagementSummary }> {
  try {
    const base = getBackendApiBase();
    const url = `${base.replace(/\/$/, '')}/signpost/videos/${encodeURIComponent(threadId)}/engagement`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      console.error('postVideoEngagement', res.status, err);
      return { ok: false };
    }
    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      engagement?: VideoEngagementSummary;
    } | null;
    return { ok: Boolean(data?.ok), engagement: data?.engagement };
  } catch (e) {
    console.error('postVideoEngagement', e);
    return { ok: false };
  }
}
