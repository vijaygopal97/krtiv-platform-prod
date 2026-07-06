'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DESTINATION_FACTS_LAYOUT } from '@/config/destinationFactsLayout';
import '@/styles/destination-facts.css';

const AUTO_ADVANCE_MS = 9000;
const ENTER_ANIMATION_MS = DESTINATION_FACTS_LAYOUT === 'compact' ? 620 : 920;
const isCompact = DESTINATION_FACTS_LAYOUT === 'compact';

type Props = {
  facts: readonly string[];
  placeName?: string;
  /** Flush inside a parent section (trail listing pages). */
  embedded?: boolean;
};

export function DestinationFactsSection({ facts, placeName, embedded = false }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [enterDone, setEnterDone] = useState(false);

  const factCount = facts.length;
  const hasMultiple = factCount > 1;
  const activeFact = facts[activeIndex] ?? facts[0];

  const goTo = useCallback(
    (index: number) => {
      if (!factCount) return;
      setActiveIndex((index + factCount) % factCount);
    },
    [factCount],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    setActiveIndex(0);
    setEnterDone(false);
  }, [facts]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.28, rootMargin: '0px 0px -6% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || enterDone || reduceMotion) return;
    const timer = window.setTimeout(() => setEnterDone(true), ENTER_ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [enterDone, inView, reduceMotion]);

  useEffect(() => {
    if (reduceMotion && inView) setEnterDone(true);
  }, [inView, reduceMotion]);

  useEffect(() => {
    if (!hasMultiple || !inView || reduceMotion || !enterDone) return;

    let intervalId = 0;
    let visible = !document.hidden;

    const tick = () => {
      if (!visible) return;
      setActiveIndex((current) => (current + 1) % factCount);
    };

    const onVisibility = () => {
      visible = !document.hidden;
    };

    intervalId = window.setInterval(tick, AUTO_ADVANCE_MS);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enterDone, factCount, hasMultiple, inView, reduceMotion]);

  if (!activeFact) return null;

  const revealed = inView && (enterDone || reduceMotion);
  const textPhase = inView && !enterDone && !reduceMotion ? 'initial' : 'swap';

  return (
    <section
      ref={rootRef}
      className={[
        'destination-facts',
        `destination-facts--${DESTINATION_FACTS_LAYOUT}`,
        embedded ? 'destination-facts--embedded' : '',
        inView ? 'destination-facts--in-view' : '',
        revealed ? 'destination-facts--revealed' : '',
        reduceMotion ? 'destination-facts--reduced' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={placeName ? `Did you know about ${placeName}?` : 'Did you know?'}
    >
      <div className="destination-facts__inner">
        <div className="destination-facts__card">
          {isCompact ? (
            <span className="destination-facts__accent" aria-hidden />
          ) : (
            <>
              <span className="destination-facts__glow" aria-hidden />
              <span className="destination-facts__shimmer" aria-hidden />
              <div className="destination-facts__badge" aria-hidden>
                ✦
              </div>
            </>
          )}

          <div className="destination-facts__content">
            <div className="destination-facts__header">
              <p className="destination-facts__eyebrow">Did you know?</p>
              {isCompact && hasMultiple ? (
                <span className="destination-facts__counter" aria-live="polite">
                  {activeIndex + 1}/{factCount}
                </span>
              ) : null}
            </div>
            <div className="destination-facts__text-wrap">
              <p
                className={`destination-facts__text destination-facts__text--${textPhase}`}
                key={activeIndex}
              >
                {activeFact}
              </p>
            </div>
          </div>

          {hasMultiple ? (
            <div className="destination-facts__controls">
              <button
                type="button"
                className="destination-facts__nav"
                aria-label="Previous fact"
                onClick={goPrev}
              >
                <ChevronLeft className="w-4 h-4" aria-hidden />
              </button>
              {!isCompact ? (
                <div className="destination-facts__dots" role="tablist" aria-label="Facts">
                  {facts.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      role="tab"
                      aria-selected={index === activeIndex}
                      aria-label={`Show fact ${index + 1} of ${factCount}`}
                      className={`destination-facts__dot ${
                        index === activeIndex ? 'destination-facts__dot--active' : ''
                      }`}
                      onClick={() => goTo(index)}
                    />
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                className="destination-facts__nav"
                aria-label="Next fact"
                onClick={goNext}
              >
                <ChevronRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
