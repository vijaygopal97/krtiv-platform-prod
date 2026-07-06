'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { TravelStoryCard } from '@/components/travelStories/TravelStoryCard';
import { fetchTravelStories } from '@/lib/travelStoriesApi';
import { useStoryViewerModal } from '@/hooks/useStoryViewerModal';
import { useTravelStoriesTapGuard } from '@/hooks/useTravelStoriesTapGuard';
import type { TravelStoryDestination } from '@/types/travelStory';
import '@/styles/travel-stories.css';
import { TravelStoryViewer } from '@/components/travelStories/TravelStoryViewer';

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      {dir === 'left' ? (
        <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function TravelStoriesSection() {
  const scroller = useRef<HTMLDivElement | null>(null);
  const tapGuardRef = useTravelStoriesTapGuard(scroller);
  const [destinations, setDestinations] = useState<TravelStoryDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const closeViewer = useCallback(() => setViewerIndex(null), []);
  const { requestClose, setTrigger } = useStoryViewerModal({
    isOpen: viewerIndex !== null,
    onClose: closeViewer,
  });

  useEffect(() => {
    let cancelled = false;
    fetchTravelStories()
      .then((d) => {
        if (!cancelled) setDestinations(d);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollBy = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.travel-story-card');
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.7;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  const openViewer = (index: number, trigger: HTMLButtonElement) => {
    setTrigger(trigger);
    setViewerIndex(index);
  };

  return (
    <section
      id="snapshots-of-maharashtra"
      className="relative overflow-visible bg-[color:var(--ivory)] py-24 md:py-36 border-b hairline"
      aria-labelledby="snapshots-of-maharashtra-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-14">
          <ScrollReveal className="max-w-2xl">
            <p className="eyebrow">Visual stories</p>
            <h2 id="snapshots-of-maharashtra-heading" className="display-lg mt-4 text-balance">
              Snapshots of Maharashtra
            </h2>
            <p className="lede mt-5">
              Discover Maharashtra through stunning visual stories — swipe sideways to browse, tap a
              card to watch.
            </p>
          </ScrollReveal>
          <div className="hidden md:flex gap-2 shrink-0">
            <button
              type="button"
              aria-label="Scroll stories left"
              onClick={() => scrollBy(-1)}
              className="w-11 h-11 rounded-full border hairline flex items-center justify-center hover:bg-[color:var(--bone)] transition shadow-sm"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              aria-label="Scroll stories right"
              onClick={() => scrollBy(1)}
              className="w-11 h-11 rounded-full border hairline flex items-center justify-center hover:bg-[color:var(--bone)] transition shadow-sm"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>
      </div>

      <div className="travel-stories-scroller-outer">
        <div
          ref={scroller}
          className="travel-stories-scroller no-scrollbar"
          role="region"
          aria-roledescription="carousel"
          aria-label="Snapshots of Maharashtra story cards"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              scrollBy(-1);
            }
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              scrollBy(1);
            }
          }}
        >
          <div className="travel-stories-rail">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={`sk-${i}`} className="travel-story-card travel-story-card--skeleton" aria-hidden />
                ))
              : destinations.map((d, i) => (
                  <TravelStoryCard
                    key={d.id}
                    destination={d}
                    index={i}
                    tapGuardRef={tapGuardRef}
                    onWatch={(trigger) => openViewer(i, trigger)}
                  />
                ))}
          </div>
        </div>
      </div>

      {portalReady && typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {viewerIndex !== null && destinations[viewerIndex] ? (
                <motion.div
                  key="travel-story-viewer-layer"
                  className="travel-story-viewer-layer"
                  role="presentation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="travel-story-viewer-layer__inner"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TravelStoryViewer
                      destinations={destinations}
                      startDestIndex={viewerIndex}
                      onClose={requestClose}
                    />
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </section>
  );
}
