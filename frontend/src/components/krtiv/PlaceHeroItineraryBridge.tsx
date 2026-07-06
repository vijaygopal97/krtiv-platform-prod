'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PLACES_NAV } from '@/lib/siteNavigation';
import '@/styles/hero-itinerary-bridge.css';

const DEFAULT_ROTATION_NAMES = PLACES_NAV.map((p) => p.label);

const FLOAT_ICONS = [
  { glyph: '📍', top: '18%', left: '8%', dur: '16s', delay: '0s' },
  { glyph: '🧭', top: '62%', left: '12%', dur: '18s', delay: '1s' },
  { glyph: '📷', top: '28%', right: '10%', dur: '15s', delay: '0.5s' },
  { glyph: '⛰', top: '70%', right: '14%', dur: '17s', delay: '2s' },
  { glyph: '🛕', top: '22%', left: '42%', dur: '20s', delay: '1.5s' },
  { glyph: '🏖', top: '58%', right: '38%', dur: '19s', delay: '0.8s' },
  { glyph: '🏛', top: '40%', left: '22%', dur: '21s', delay: '2.5s' },
] as const;

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${8 + (i * 6.5) % 84}%`,
  bottom: `${10 + (i * 7) % 40}%`,
  delay: `${(i * 0.7) % 5}s`,
  tx: `${(i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 8)}px`,
}));

type Props = {
  currentDestination: string;
  /** Override rotating names (e.g. Maharashtra districts on curated pages). */
  rotationNames?: readonly string[];
};

export function PlaceHeroItineraryBridge({ currentDestination, rotationNames }: Props) {
  const names = rotationNames ?? DEFAULT_ROTATION_NAMES;
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [nameIndex, setNameIndex] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry?.isIntersecting ?? false);
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const start = names.indexOf(currentDestination);
    if (start >= 0) setNameIndex(start);
  }, [currentDestination, names]);

  const nameCount = names.length;

  useEffect(() => {
    const t = window.setInterval(() => {
      setNameIndex((i) => (i + 1) % nameCount);
    }, 3200);
    return () => window.clearInterval(t);
  }, [nameCount]);

  const displayName = names[nameIndex] ?? currentDestination;
  const isCurrent = displayName === currentDestination;

  return (
    <section
      ref={rootRef}
      className={`hero-itinerary-bridge ${inView ? 'hero-itinerary-bridge--in-view' : ''} ${
        scrolled ? 'hero-itinerary-bridge--scrolled' : ''
      }`}
      aria-hidden
    >
      <div className="hero-itinerary-bridge__inner">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="hero-itinerary-bridge__particle"
            style={
              {
                left: p.left,
                bottom: p.bottom,
                '--hib-delay': p.delay,
                '--hib-tx': p.tx,
              } as CSSProperties
            }
          />
        ))}

        {FLOAT_ICONS.map((icon, i) => (
          <span
            key={i}
            className="hero-itinerary-bridge__icon"
            style={
              {
                top: icon.top,
                left: 'left' in icon ? icon.left : undefined,
                right: 'right' in icon ? icon.right : undefined,
                '--hib-dur': icon.dur,
                '--hib-delay': icon.delay,
              } as CSSProperties
            }
          >
            {icon.glyph}
          </span>
        ))}

        {/* Landmark silhouettes (outline-style SVG) */}
        <svg
          className="hero-itinerary-bridge__landmark"
          style={{ left: '6%', top: '52%', width: 48, height: 48, animationDelay: '0s' }}
          viewBox="0 0 48 48"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 40V18l16-10 16 10v22H8zm6-4h20V20L24 13 14 20v16z" opacity="0.9" />
        </svg>
        <svg
          className="hero-itinerary-bridge__landmark"
          style={{ left: '22%', top: '38%', width: 40, height: 40, animationDelay: '0.4s' }}
          viewBox="0 0 40 40"
          fill="currentColor"
          aria-hidden
        >
          <path d="M6 34h28L20 8 6 34zm7-6h14L20 16 13 28z" />
        </svg>
        <svg
          className="hero-itinerary-bridge__landmark"
          style={{ right: '24%', top: '48%', width: 44, height: 36, animationDelay: '0.8s' }}
          viewBox="0 0 44 36"
          fill="currentColor"
          aria-hidden
        >
          <path d="M4 32c8-14 16-22 18-28 2 6 10 14 18 28H4z" />
        </svg>
        <svg
          className="hero-itinerary-bridge__landmark"
          style={{ right: '8%', top: '40%', width: 42, height: 42, animationDelay: '1.2s' }}
          viewBox="0 0 42 42"
          fill="currentColor"
          aria-hidden
        >
          <path d="M21 4l-4 8H8l6 5-2 9 9-5 9 5-2-9 6-5h-9l-4-8z" />
        </svg>
        <svg
          className="hero-itinerary-bridge__landmark"
          style={{ left: '44%', top: '58%', width: 56, height: 28, animationDelay: '1.6s' }}
          viewBox="0 0 56 28"
          fill="currentColor"
          aria-hidden
        >
          <path d="M0 24 Q14 8 28 16 T56 20 L56 28 0 28z" />
        </svg>

        <svg
          className="hero-itinerary-bridge__route-svg"
          viewBox="0 0 800 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            className="hero-itinerary-bridge__route-path"
            d="M 0 58 C 120 28, 200 72, 320 48 S 520 32, 640 55 S 740 42, 800 50"
            pathLength={100}
          />
          <circle className="hero-itinerary-bridge__pin" r="5">
            <animateMotion
              dur="10s"
              repeatCount="indefinite"
              path="M 0 58 C 120 28, 200 72, 320 48 S 520 32, 640 55 S 740 42, 800 50"
            />
          </circle>
        </svg>

        <div className="hero-itinerary-bridge__destinations">
          <p className="hero-itinerary-bridge__dest-label">Discover Maharashtra</p>
          <div className="hero-itinerary-bridge__dest-name" key={displayName}>
            <span
              className={`hero-itinerary-bridge__dest-word ${
                isCurrent ? 'hero-itinerary-bridge__dest-word--current' : ''
              }`}
            >
              {displayName}
            </span>
          </div>
        </div>
      </div>

      <svg className="hero-itinerary-bridge__wave" viewBox="0 0 720 48" preserveAspectRatio="none" aria-hidden>
        <path
          fill="currentColor"
          d="M0,32 C120,8 240,48 360,28 S600,8 720,32 L720,48 L0,48 Z"
        />
      </svg>
    </section>
  );
}
