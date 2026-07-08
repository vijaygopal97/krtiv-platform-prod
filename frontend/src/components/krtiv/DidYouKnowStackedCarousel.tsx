'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveSlideImage } from '@/lib/heroSlidesApi';
import '@/styles/did-you-know-carousel.css';

const AUTO_MS = 5000;

type Props = {
  facts: readonly string[];
  placeName?: string;
  embedded?: boolean;
  backgroundImage?: string;
};

export function DidYouKnowStackedCarousel({
  facts,
  placeName,
  embedded = false,
  backgroundImage = '/curated/unesco/ajanta-caves.jpg',
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const count = facts.length;
  const hasMultiple = count > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!count) return;
      setActiveIndex((index + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    setActiveIndex(0);
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
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasMultiple || !inView || reduceMotion) return;
    let visible = !document.hidden;
    const onVis = () => {
      visible = !document.hidden;
    };
    const id = window.setInterval(() => {
      if (visible) setActiveIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [count, hasMultiple, inView, reduceMotion]);

  if (!count || !facts[0]) return null;

  const bg = resolveSlideImage(backgroundImage);

  const cardClass = (index: number) => {
    if (index === activeIndex) return 'dykc__card dykc__card--active';
    const diff = (index - activeIndex + count) % count;
    if (diff === 1) return 'dykc__card dykc__card--behind-1';
    if (diff === 2) return 'dykc__card dykc__card--behind-2';
    return 'dykc__card';
  };

  return (
    <section
      ref={rootRef}
      className={['dykc', inView ? 'dykc--active' : '', embedded ? 'dykc--embedded' : ''].filter(Boolean).join(' ')}
      aria-label={placeName ? `Did you know about ${placeName}?` : 'Did you know?'}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bg} alt="" className="dykc__bg" loading="lazy" />
      <div className="dykc__shade" aria-hidden />

      <div className="dykc__layout">
        <div>
          <h2 className="dykc__title">Did You Know?</h2>
          {hasMultiple ? (
            <div className="dykc__controls">
              <button type="button" className="dykc__btn" aria-label="Previous fact" onClick={goPrev}>
                <ChevronLeft className="w-5 h-5" aria-hidden />
              </button>
              <div className="dykc__dots" role="tablist" aria-label="Facts">
                {facts.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === activeIndex}
                    aria-label={`Fact ${i + 1} of ${count}`}
                    className={`dykc__dot ${i === activeIndex ? 'dykc__dot--active' : ''}`}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
              <button type="button" className="dykc__btn" aria-label="Next fact" onClick={goNext}>
                <ChevronRight className="w-5 h-5" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>

        <div className="dykc__stack" aria-live="polite">
          {facts.map((fact, index) => (
            <div key={index} className={cardClass(index)} aria-hidden={index !== activeIndex}>
              <p className="dykc__card-index">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </p>
              <p className="dykc__card-text">{fact}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
