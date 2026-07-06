import { getApiBase } from '@/lib/basePath';
import type { JourneyCard, JourneyRecord } from '@/types/journey';

/** On the app server, talk to krtiv-api on localhost (build + SSR). */
function serverApiBases(): string[] {
  const internal = (process.env.INTERNAL_API_URL || 'http://127.0.0.1:5001/api').replace(/\/$/, '');
  let publicRoot = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
  if (publicRoot.endsWith('/api')) publicRoot = publicRoot.slice(0, -4);
  const publicApi = publicRoot ? `${publicRoot}/api` : '';
  const bases = [internal];
  if (publicApi && publicApi !== internal) bases.push(publicApi);
  return bases;
}

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export async function fetchJourneyCards(): Promise<JourneyCard[]> {
  const init: RequestInit =
    typeof window === 'undefined' ? { next: { revalidate: 60 } } : { cache: 'no-store' };

  const bases =
    typeof window === 'undefined' ? serverApiBases() : [getApiBase().replace(/\/$/, '')];

  for (const base of bases) {
    const { res, data } = await fetchJson(`${base}/journeys`, init);
    if (res.ok && data.success) {
      return (data.journeys as JourneyCard[]).map((j) => ({
        ...j,
        heroImage: j.heroImage || j.image,
      }));
    }
  }
  return [];
}

export async function fetchJourneyBySlug(slug: string): Promise<{
  journey: JourneyRecord | null;
  related: JourneyCard[];
}> {
  const init: RequestInit =
    typeof window === 'undefined' ? { next: { revalidate: 60 } } : { cache: 'no-store' };

  const bases =
    typeof window === 'undefined' ? serverApiBases() : [getApiBase().replace(/\/$/, '')];

  for (const base of bases) {
    const { res, data } = await fetchJson(`${base}/journeys/${encodeURIComponent(slug)}`, init);
    if (res.ok && data.success && data.journey) {
      return {
        journey: data.journey as JourneyRecord,
        related: (data.related as JourneyCard[]) || [],
      };
    }
  }
  return { journey: null, related: [] };
}

export function journeyCmsKey(slug: string, field: string) {
  return `journey.${slug}.${field}`;
}
