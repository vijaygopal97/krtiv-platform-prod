import { assetPath } from '@/lib/basePath';

/**
 * Next.js gallery API (not proxied to SignPost backend — see next.config rewrites).
 */
export function galleryApiPath(slug: string): string {
  return assetPath(`/gallery-api/destination/${encodeURIComponent(slug)}`);
}
