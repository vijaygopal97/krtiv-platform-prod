'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { SnapshotStoryCard } from '@/components/snapshots/SnapshotStoryCard';
import { SnapshotGalleryModal } from '@/components/snapshots/SnapshotGalleryModal';
import { fetchSnapshotStories } from '@/lib/snapshotStoriesApi';
import type { SnapshotStory } from '@/types/snapshotStory';
import '@/styles/snapshots-section.css';

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      {dir === 'left' ? (
        <path
          d="M15 6l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function CardSkeleton() {
  return <div className="snapshot-card-skeleton" aria-hidden />;
}

export function SnapshotsOfMaharashtra() {
  const scroller = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [stories, setStories] = useState<SnapshotStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStory, setActiveStory] = useState<SnapshotStory | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSnapshotStories()
      .then((data) => {
        if (!cancelled) setStories(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollByPage = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>('.snapshot-slide');
    const step = slide ? slide.offsetWidth + 20 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scroller.current;
    if (!el || e.button !== 0) return;
    drag.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging');
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scroller.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent) => {
    const el = scroller.current;
    if (!el) return;
    drag.current.active = false;
    el.classList.remove('is-dragging');
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      /* released */
    }
    if (drag.current.moved) {
      window.setTimeout(() => {
        drag.current.moved = false;
      }, 100);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByPage(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByPage(1);
    }
  };

  const openStory = (story: SnapshotStory) => {
    if (drag.current.moved) return;
    setActiveStory(story);
  };

  return (
    <section
      id="snapshots-of-maharashtra"
      className="relative bg-[color:var(--ivory)] py-24 md:py-36 border-b hairline"
      aria-labelledby="snapshots-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16">
          <ScrollReveal className="max-w-3xl">
            <p className="eyebrow">Visual stories</p>
            <h2 id="snapshots-heading" className="display-lg mt-4 text-balance">
              Snapshots of Maharashtra
            </h2>
            <p className="lede mt-5">
              Discover Maharashtra through stunning visual stories from across forts, beaches,
              wildlife, heritage, culture and hidden destinations.
            </p>
          </ScrollReveal>

          <div className="hidden md:flex gap-2 shrink-0">
            <button
              type="button"
              aria-label="Scroll to previous stories"
              onClick={() => scrollByPage(-1)}
              className="w-11 h-11 rounded-full border hairline flex items-center justify-center text-[color:var(--ink)] hover:bg-[color:var(--bone)] transition shadow-sm"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              aria-label="Scroll to next stories"
              onClick={() => scrollByPage(1)}
              className="w-11 h-11 rounded-full border hairline flex items-center justify-center text-[color:var(--ink)] hover:bg-[color:var(--bone)] transition shadow-sm"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="snapshot-scroller no-scrollbar"
        role="region"
        aria-roledescription="carousel"
        aria-label="Snapshots of Maharashtra photo stories"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ul className="snapshot-rail">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <li key={`sk-${i}`} className="snapshot-slide" role="listitem">
                  <CardSkeleton />
                </li>
              ))
            : stories.map((story, i) => (
                <li key={story.id} className="snapshot-slide" role="listitem">
                  <ScrollReveal delay={Math.min(i * 60, 360)}>
                    <SnapshotStoryCard story={story} index={i} onOpen={() => openStory(story)} />
                  </ScrollReveal>
                </li>
              ))}
        </ul>
      </div>

      <div className="flex md:hidden items-center justify-center gap-4 mt-8 px-6">
        <button
          type="button"
          aria-label="Previous stories"
          onClick={() => scrollByPage(-1)}
          className="w-11 h-11 rounded-full border hairline flex items-center justify-center bg-white/80 shadow-sm"
        >
          <Chevron dir="left" />
        </button>
        <button
          type="button"
          aria-label="Next stories"
          onClick={() => scrollByPage(1)}
          className="w-11 h-11 rounded-full border hairline flex items-center justify-center bg-white/80 shadow-sm"
        >
          <Chevron dir="right" />
        </button>
      </div>

      {activeStory ? (
        <SnapshotGalleryModal story={activeStory} onClose={() => setActiveStory(null)} />
      ) : null}
    </section>
  );
}
