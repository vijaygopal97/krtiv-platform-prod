'use client';

import { FEATURE_SHEKRU_MASCOT } from '@/lib/featureFlags';

type Props = {
  variant?: 'idle' | 'walking';
  className?: string;
  label?: string;
};

/** Animated Shekru (Indian Giant Squirrel) — non-blocking loading mascot. */
export function ShekruLoader({
  variant = 'walking',
  className = '',
  label = 'Shekru is planning your trip',
}: Props) {
  if (!FEATURE_SHEKRU_MASCOT) {
    return null;
  }

  return (
    <div
      className={`shekru-loader ${variant === 'walking' ? 'shekru-loader--walking' : ''} ${className}`}
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="60" cy="108" rx="28" ry="6" fill="#000" opacity="0.08" />
        <g className="shekru-loader__body">
          <path
            className="shekru-loader__tail"
            d="M88 52c14 8 22 22 18 38-2 8-10 14-18 12"
            stroke="#8B4513"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="52" cy="68" rx="22" ry="26" fill="#C45C26" />
          <ellipse cx="52" cy="72" rx="14" ry="16" fill="#E8925A" />
          <circle cx="38" cy="48" r="18" fill="#C45C26" />
          <circle cx="32" cy="44" r="3" fill="#1a1a1a" className="shekru-loader__eye" />
          <circle cx="44" cy="44" r="3" fill="#1a1a1a" className="shekru-loader__eye" />
          <ellipse cx="38" cy="52" rx="4" ry="2.5" fill="#FF9933" />
          <path d="M26 42c-6-2-10 2-8 8 2 4 8 2 8-2" fill="#8B4513" />
          <path d="M68 88c8 4 12 0 10-6-2-6-10-4-12 2" fill="#8B4513" />
          <path d="M36 88c-8 4-12 0-10-6 2-6 10-4 12 2" fill="#8B4513" />
        </g>
      </svg>
    </div>
  );
}
