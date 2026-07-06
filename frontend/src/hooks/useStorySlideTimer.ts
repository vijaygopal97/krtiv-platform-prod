'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const SLIDE_MS = 5000;

type Options = {
  active: boolean;
  slideKey: string;
  onComplete: () => void;
  holdPausedRef: React.RefObject<boolean>;
};

export function useStorySlideTimer({ active, slideKey, onComplete, holdPausedRef }: Options) {
  const [progress, setProgress] = useState(0);

  const elapsedRef = useRef(0);
  const segmentStartRef = useRef(0);
  const rafRef = useRef(0);
  const frozenRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    elapsedRef.current = 0;
    segmentStartRef.current = performance.now();
    frozenRef.current = false;
    setProgress(0);
  }, [slideKey]);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    segmentStartRef.current = performance.now();

    const tick = (now: number) => {
      if (!active) return;

      const frozen = document.hidden || Boolean(holdPausedRef.current);
      if (frozen) {
        if (!frozenRef.current) {
          elapsedRef.current += Math.max(0, now - segmentStartRef.current);
          frozenRef.current = true;
        }
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (frozenRef.current) {
        frozenRef.current = false;
        segmentStartRef.current = now;
      }

      const total = elapsedRef.current + (now - segmentStartRef.current);
      const pct = Math.min(100, (total / SLIDE_MS) * 100);
      setProgress(pct);

      if (pct >= 100) {
        elapsedRef.current = 0;
        segmentStartRef.current = now;
        frozenRef.current = false;
        onCompleteRef.current();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, slideKey, holdPausedRef]);

  return { progress };
}

export { SLIDE_MS };
