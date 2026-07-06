import type { SnapshotStory } from '@/types/snapshotStory';
import { assetPath } from '@/lib/basePath';

let cache: SnapshotStory[] | null = null;

export async function fetchSnapshotStories(): Promise<SnapshotStory[]> {
  if (cache) return cache;

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(assetPath('/api/snapshot-stories'));
      if (res.ok) {
        const data = (await res.json()) as { stories: SnapshotStory[] };
        cache = data.stories;
        return data.stories;
      }
    } catch {
      /* fallback */
    }
    const { getSnapshotStories } = await import('@/data/snapshotStories');
    const stories = getSnapshotStories();
    cache = stories;
    return stories;
  }

  const { getSnapshotStories } = await import('@/data/snapshotStories');
  return getSnapshotStories();
}
