'use client';

import { useEffect, useRef, useState } from 'react';
import {
  type PlannerBackgroundKey,
  plannerBackgroundUrl,
  PLANNER_CATEGORY_BACKGROUNDS,
} from '@/config/plannerCategoryBackgrounds';

type Props = {
  activeKey: PlannerBackgroundKey;
  transitionMs?: number;
};

export function PlannerSceneBackground({ activeKey, transitionMs = 600 }: Props) {
  const [displayUrl, setDisplayUrl] = useState(() => plannerBackgroundUrl(activeKey));
  const [incomingUrl, setIncomingUrl] = useState<string | null>(null);
  const [incomingVisible, setIncomingVisible] = useState(false);
  const preloaded = useRef(new Set<string>());

  const preload = (url: string) => {
    if (preloaded.current.has(url)) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    preloaded.current.add(url);
  };

  useEffect(() => {
    PLANNER_CATEGORY_BACKGROUNDS[activeKey].forEach((_, i) =>
      preload(plannerBackgroundUrl(activeKey, i))
    );
  }, [activeKey]);

  useEffect(() => {
    const next = plannerBackgroundUrl(activeKey);
    if (next === displayUrl && !incomingUrl) return;

    preload(next);
    setIncomingUrl(next);
    setIncomingVisible(false);
    const raf = requestAnimationFrame(() => setIncomingVisible(true));
    const done = window.setTimeout(() => {
      setDisplayUrl(next);
      setIncomingUrl(null);
      setIncomingVisible(false);
    }, transitionMs);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
  }, [activeKey, displayUrl, incomingUrl, transitionMs]);

  const duration = `${transitionMs}ms`;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-center scale-[1.03]"
        style={{ backgroundImage: `url(${displayUrl})` }}
      />
      {incomingUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center scale-[1.03]"
          style={{
            backgroundImage: `url(${incomingUrl})`,
            opacity: incomingVisible ? 1 : 0,
            transition: `opacity ${duration} ease-in-out`,
          }}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410]/72 via-[#1a1410]/55 to-[#1a1410]/78" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_20%,rgba(234,160,72,0.12),transparent_55%)]" />
    </div>
  );
}
