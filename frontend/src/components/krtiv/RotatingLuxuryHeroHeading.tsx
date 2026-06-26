'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { HOME_HERO_HIGHLIGHT } from '@/lib/circuitHeroHeadings';

const HOLD_MS = 2600;
const TRANSITION_MS = 750;

type Props = {
  /** Circuit keyword (Pride, Peace, …). Alternates with India. */
  highlight: string;
  centered?: boolean;
  className?: string;
};

/**
 * "You will find {keyword} here" — loops highlight ↔ India with crossfade.
 */
export function RotatingLuxuryHeroHeading({ highlight, centered = false, className = '' }: Props) {
  const keywords = useMemo(
    () => [highlight, HOME_HERO_HIGHLIGHT],
    [highlight]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % keywords.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [keywords.length, reduceMotion]);

  const activeWord = keywords[reduceMotion ? 0 : activeIndex];

  return (
    <h1
      className={`luxury-hero-heading luxury-hero-heading--rotate ${centered ? 'luxury-hero-heading--center' : ''} ${className}`}
      aria-live="polite"
      style={{ '--luxury-rotate-ms': `${TRANSITION_MS}ms` } as CSSProperties}
    >
      <span className="luxury-hero-heading__line">
        You will find{' '}
        <span className="luxury-hero-heading__keyword">
          <span className="luxury-hero-heading__keyword-slot" aria-hidden>
            {keywords.map((word, i) => (
              <span
                key={word}
                className="luxury-hero-heading__keyword-layer"
                data-active={!reduceMotion && i === activeIndex}
              >
                {word}
              </span>
            ))}
          </span>
          <span className="sr-only">{activeWord}</span>
          <span className="luxury-hero-heading__underline luxury-hero-heading__underline--steady" aria-hidden />
        </span>{' '}
        here
      </span>
    </h1>
  );
}
