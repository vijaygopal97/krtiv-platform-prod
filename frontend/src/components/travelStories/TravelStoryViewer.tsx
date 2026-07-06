'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { TravelStoryDestination } from '@/types/travelStory';
import { preloadTravelStoryImage } from '@/lib/travelStoriesApi';
import { useStorySlideTimer } from '@/hooks/useStorySlideTimer';
import { useStoryStagePointer } from '@/hooks/useStoryStagePointer';

type Props = {
  destinations: TravelStoryDestination[];
  startDestIndex: number;
  onClose: () => void;
};

export function TravelStoryViewer({ destinations, startDestIndex, onClose }: Props) {
  const [destIndex, setDestIndex] = useState(startDestIndex);
  const [slideIndex, setSlideIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const holdPauseRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const closeLockRef = useRef(false);

  const dest = destinations[destIndex];
  const slides = dest?.stories ?? [];
  const slide = slides[slideIndex];
  const slideKey = `${destIndex}-${slideIndex}-${slide?.image ?? ''}`;

  const stateRef = useRef({ destIndex, slideIndex });
  stateRef.current = { destIndex, slideIndex };

  const goNext = useCallback(() => {
    const { destIndex: di, slideIndex: si } = stateRef.current;
    const d = destinations[di];
    if (!d) return;
    if (si < d.stories.length - 1) {
      setSlideIndex(si + 1);
      return;
    }
    if (di < destinations.length - 1) {
      setDestIndex(di + 1);
      setSlideIndex(0);
      return;
    }
    onClose();
  }, [destinations, onClose]);

  const goPrev = useCallback(() => {
    const { destIndex: di, slideIndex: si } = stateRef.current;
    if (si > 0) {
      setSlideIndex(si - 1);
      return;
    }
    if (di > 0) {
      const prev = destinations[di - 1];
      setDestIndex(di - 1);
      setSlideIndex(Math.max(0, prev.stories.length - 1));
    }
  }, [destinations]);

  const goNextRef = useRef(goNext);
  const goPrevRef = useRef(goPrev);
  goNextRef.current = goNext;
  goPrevRef.current = goPrev;

  const goNextStable = useCallback(() => goNextRef.current(), []);
  const goPrevStable = useCallback(() => goPrevRef.current(), []);

  const onHoldStart = useCallback(() => {
    holdPauseRef.current = true;
    setUserPaused(true);
  }, []);

  const onHoldEnd = useCallback(() => {
    holdPauseRef.current = false;
    setUserPaused(false);
  }, []);

  const stagePointer = useStoryStagePointer({
    stageRef,
    onTapLeft: goPrevStable,
    onTapRight: goNextStable,
    onHoldStart,
    onHoldEnd,
  });

  const { progress } = useStorySlideTimer({
    active: Boolean(slide),
    slideKey,
    onComplete: goNextStable,
    holdPausedRef: holdPauseRef,
  });

  const handleClose = useCallback(
    (e?: React.SyntheticEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (closeLockRef.current) return;
      closeLockRef.current = true;
      holdPauseRef.current = false;
      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    mountedRef.current = true;
    rootRef.current?.focus({ preventScroll: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      mountedRef.current = false;
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === ' ') {
        e.preventDefault();
        holdPauseRef.current = !holdPauseRef.current;
        setUserPaused(holdPauseRef.current);
      }
      if (e.key === 'ArrowRight') goNextRef.current();
      if (e.key === 'ArrowLeft') goPrevRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  useEffect(() => {
    if (!slide) return;
    preloadTravelStoryImage(slide.image);
    const next = slides[slideIndex + 1];
    if (next) preloadTravelStoryImage(next.image);
    const nextDest = destinations[destIndex + 1];
    if (!next && nextDest?.stories[0]) preloadTravelStoryImage(nextDest.stories[0].image);
  }, [slide, slideIndex, slides, destIndex, destinations]);

  if (!dest || !slide) return null;

  return (
    <div className="travel-story-viewer" role="presentation">
      <div
        ref={rootRef}
        className="travel-story-viewer__shell"
        role="dialog"
        aria-modal="true"
        aria-label={`${dest.title} travel story`}
        tabIndex={-1}
      >
        <div
          ref={stageRef}
          className="travel-story-viewer__stage"
          {...stagePointer}
        >
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={slideKey}
              className="travel-story-viewer__slide"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt=""
                aria-hidden
                className="travel-story-viewer__image-bg"
                loading="eager"
                decoding="async"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.caption}
                className="travel-story-viewer__image"
                loading="eager"
                decoding="async"
              />
              <div className="travel-story-viewer__shade" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="travel-story-viewer__chrome">
          <div className="travel-story-viewer__progress" aria-hidden>
            {slides.map((_, i) => (
              <div key={i} className="travel-story-viewer__progress-track">
                <div
                  className="travel-story-viewer__progress-fill"
                  style={{
                    width:
                      i < slideIndex ? '100%' : i === slideIndex ? `${progress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <header className="travel-story-viewer__header">
            <div className="travel-story-viewer__profile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dest.avatarImage} alt="" className="travel-story-viewer__avatar" />
              <div className="travel-story-viewer__profile-text">
                <p className="travel-story-viewer__name">{dest.title}</p>
                <p className="travel-story-viewer__category">{dest.category}</p>
              </div>
            </div>
            <button
              type="button"
              className="travel-story-viewer__close-fab"
              onPointerUp={handleClose}
              onClick={handleClose}
              aria-label="Close Story"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>
        </div>

        <div className="travel-story-viewer__copy">
          <span className="travel-story-viewer__location">{slide.location}</span>
          <h3 className="travel-story-viewer__slide-title">{slide.title}</h3>
          <p className="travel-story-viewer__caption">{slide.caption}</p>
        </div>

        <p className="sr-only" aria-live="polite">
          Story {slideIndex + 1} of {slides.length} for {dest.title}.
          {userPaused || holdPauseRef.current ? ' Paused.' : ' Playing.'}
        </p>
      </div>
    </div>
  );
}
