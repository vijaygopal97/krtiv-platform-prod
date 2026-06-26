import { getApiBase } from '@/lib/basePath';

export async function trackKeywordGeneration(payload: {
  keywords: string[];
  categoryFocus?: string;
  categorySlug?: string;
}): Promise<void> {
  try {
    const base = getApiBase().replace(/\/$/, '');
    await fetch(`${base}/planner/track-generation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    /* non-blocking */
  }
}
