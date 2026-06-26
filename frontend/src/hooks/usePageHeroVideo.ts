'use client';

import { useEffect, useState } from 'react';
import { resolveHeroVideoAsync, type ResolvedHeroVideo } from '@/config/heroVideos';

const cache = new Map<string, ResolvedHeroVideo>();

export function usePageHeroVideo(scope: string | undefined, fallbackPoster: string) {
  const [resolved, setResolved] = useState<ResolvedHeroVideo>({
    videoSrc: null,
    poster: fallbackPoster,
    source: 'poster',
  });
  const [ready, setReady] = useState(!scope);

  useEffect(() => {
    if (!scope) {
      setResolved({ videoSrc: null, poster: fallbackPoster, source: 'poster' });
      setReady(true);
      return;
    }

    const cached = cache.get(scope);
    if (cached) {
      setResolved(cached);
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);

    resolveHeroVideoAsync(scope, fallbackPoster)
      .then((r) => {
        if (cancelled) return;
        cache.set(scope, r);
        setResolved(r);
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = { videoSrc: null, poster: fallbackPoster, source: 'poster' as const };
        setResolved(fallback);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [scope, fallbackPoster]);

  return {
    videoSrc: resolved.videoSrc,
    poster: resolved.poster,
    ready,
    source: resolved.source,
    useBackgroundVideo: Boolean(scope && resolved.videoSrc),
  };
}
