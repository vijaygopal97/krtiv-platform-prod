'use client';

import { useMemo } from 'react';
import type { CategoryItinerary } from './data';
import {
  getMaharashtraMapPoints,
  MAHARASHTRA_BOUNDARY_PATH,
  MAHARASHTRA_MAP_TRANSFORM,
} from './maharashtraMapUtils';

type Props = {
  itinerary: CategoryItinerary;
  activeDay: number;
  onActiveDayChange: (index: number) => void;
  id?: string;
  /** Tailwind aspect ratio class for the map frame */
  aspectClassName?: string;
  className?: string;
};

export function MaharashtraMapVisual({
  itinerary,
  activeDay,
  onActiveDayChange,
  id,
  aspectClassName = 'aspect-[4/5] md:aspect-[4/5]',
  className = '',
}: Props) {
  const points = useMemo(() => getMaharashtraMapPoints(itinerary), [itinerary]);

  const routePath = useMemo(() => {
    if (points.length < 2) return '';
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ');
  }, [points]);

  if (points.length === 0) {
    return (
      <div
        id={id}
        className={`relative rounded-[20px] overflow-hidden border hairline bg-[color:var(--bone)] ${aspectClassName} ${className}`}
        aria-hidden
      />
    );
  }

  return (
    <div
      id={id}
      className={`relative rounded-[20px] overflow-hidden border hairline bg-[color:var(--map-water)] shadow-[0_40px_120px_-70px_rgba(47,71,62,0.65)] ${aspectClassName} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="mh-sea-embed" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--map-water)" />
            <stop offset="100%" stopColor="var(--map-water-deep)" />
          </linearGradient>
          <linearGradient id="mh-terrain-embed" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--map-land-light)" />
            <stop offset="48%" stopColor="var(--map-land-mid)" />
            <stop offset="100%" stopColor="var(--map-land-green)" />
          </linearGradient>
          <pattern id="mh-grid-embed" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M4 0H0V4" fill="none" stroke="rgba(48,72,54,0.08)" strokeWidth="0.18" />
          </pattern>
          <radialGradient id="mh-glow-embed" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#mh-sea-embed)" />
        <path
          d="M16 0 H100 V100 H9 C15 86 20 72 18 56 C16 39 15 20 21 0 Z"
          fill="url(#mh-terrain-embed)"
          opacity="0.78"
        />
        <path
          d="M4 18 C9 20 13 19 18 16 M2 35 C8 32 13 33 18 36 M1 53 C7 49 13 49 19 52 M0 69 C7 66 12 66 18 70 M1 84 C8 81 13 82 18 86"
          fill="none"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth="0.32"
        />
        <rect width="100" height="100" fill="url(#mh-grid-embed)" opacity="0.55" />
        <rect width="100" height="100" fill="url(#mh-glow-embed)" />
      </svg>

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Map of Maharashtra with itinerary stops"
      >
        <defs>
          <clipPath id="mh-state-clip-embed">
            <path d={MAHARASHTRA_BOUNDARY_PATH} />
          </clipPath>
          <linearGradient id="mh-state-fill-embed" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--map-land-light)" />
            <stop offset="42%" stopColor="var(--map-land-mid)" />
            <stop offset="100%" stopColor="var(--map-land-green)" />
          </linearGradient>
          <filter id="mh-state-shadow-embed" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="rgba(29,37,28,0.34)" />
          </filter>
        </defs>
        <g transform={MAHARASHTRA_MAP_TRANSFORM}>
          <g filter="url(#mh-state-shadow-embed)">
            <path
              d={MAHARASHTRA_BOUNDARY_PATH}
              fill="url(#mh-state-fill-embed)"
              stroke="var(--map-border)"
              strokeWidth="0.42"
              strokeLinejoin="round"
            />
          </g>
          <g clipPath="url(#mh-state-clip-embed)" opacity="0.68">
            <path
              d="M 14 17 C 25 11 34 15 44 12 S 62 12 76 9 M 16 30 C 29 23 45 29 57 24 S 78 23 91 18 M 14 43 C 28 37 41 42 55 36 S 77 35 94 31 M 13 56 C 28 50 42 55 57 49 S 76 48 93 44 M 12 69 C 27 62 43 68 58 61 S 77 62 91 57 M 11 82 C 27 75 42 80 58 74 S 76 76 90 70"
              fill="none"
              stroke="var(--map-contour)"
              strokeWidth="0.25"
            />
            <path
              d="M 14 23 Q 18 38 16 54 T 21 82"
              fill="none"
              stroke="rgba(77,72,39,0.45)"
              strokeWidth="0.42"
              strokeDasharray="0.7 0.75"
            />
          </g>
          <text x="66" y="87" fontSize="1.7" fill="rgba(36,50,34,0.46)" style={{ letterSpacing: '0.18em' }}>
            DECCAN PLATEAU
          </text>
        </g>
        <text
          x="6"
          y="52"
          fontSize="2"
          fill="rgba(15,72,91,0.58)"
          style={{ letterSpacing: '0.25em' }}
          transform="rotate(-78 8 50)"
        >
          ARABIAN SEA
        </text>

        <g transform={MAHARASHTRA_MAP_TRANSFORM}>
          {routePath ? (
            <path
              d={routePath}
              fill="none"
              stroke="var(--terracotta, #B5562D)"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeDasharray="1.2 1.2"
              className="krtiv-route"
            />
          ) : null}

          {points.map((p, i) => {
            const isActive = activeDay === i;
            return (
              <g
                key={i}
                transform={`translate(${p.x} ${p.y})`}
                onClick={() => onActiveDayChange(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onActiveDayChange(i);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`Day ${p.day.day}, ${p.day.location}`}
                style={{ cursor: 'pointer' }}
                className="krtiv-pin"
              >
                {isActive ? (
                  <circle r="3.5" fill="var(--terracotta, #B5562D)" opacity="0.18">
                    <animate attributeName="r" values="2.2;4.6;2.2" dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.35;0;0.35" dur="2.2s" repeatCount="indefinite" />
                  </circle>
                ) : null}
                <circle
                  r={isActive ? 1.9 : 1.4}
                  fill={isActive ? 'var(--terracotta, #B5562D)' : '#1a1410'}
                  stroke="#fff"
                  strokeWidth="0.4"
                  style={{ transition: 'all 240ms cubic-bezier(0.22,1,0.36,1)' }}
                />
                <text
                  x="0"
                  y={-2.6}
                  textAnchor="middle"
                  fontSize="1.9"
                  fontWeight={600}
                  fill={isActive ? 'var(--terracotta, #B5562D)' : '#1a1410'}
                  style={{ pointerEvents: 'none' }}
                >
                  {p.day.day}
                </text>
                <text
                  x="0"
                  y={3.6}
                  textAnchor="middle"
                  fontSize="1.8"
                  fill="rgba(26,20,16,0.85)"
                  style={{ pointerEvents: 'none', letterSpacing: '0.04em' }}
                >
                  {p.day.location.split('—')[0].trim()}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/70 backdrop-blur flex items-center justify-center text-[10px] tracking-widest text-[color:var(--ink-soft)] border hairline">
        N
      </div>
      <div className="absolute bottom-4 left-4 text-[10px] tracking-[0.25em] uppercase text-[color:var(--ink-soft)] bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border hairline">
        Maharashtra · {points.length} stops
      </div>
    </div>
  );
}
