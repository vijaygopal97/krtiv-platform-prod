'use client';

import type { CSSProperties } from 'react';

const ICONS = [
  { char: '✦', top: '12%', left: '8%', size: 'text-lg', duration: '16s', delay: '0s' },
  { char: '★', top: '22%', right: '10%', size: 'text-sm', duration: '18s', delay: '2s' },
  { char: '◎', top: '55%', left: '5%', size: 'text-base', duration: '20s', delay: '1s' },
  { char: '✧', top: '70%', right: '7%', size: 'text-xl', duration: '15s', delay: '3s' },
  { char: '🧭', top: '18%', left: '18%', size: 'text-base', duration: '22s', delay: '0.5s' },
  { char: '📍', top: '48%', right: '14%', size: 'text-sm', duration: '17s', delay: '1.5s' },
  { char: '✈', top: '78%', left: '12%', size: 'text-sm', duration: '19s', delay: '2.5s' },
  { char: '✦', top: '35%', right: '22%', size: 'text-xs', duration: '21s', delay: '4s' },
] as const;

export function PlannerFloatingDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {ICONS.map((item, i) => (
        <span
          key={i}
          className={`planner-float-icon ${item.size}`}
          style={
            {
              top: item.top,
              left: 'left' in item ? item.left : undefined,
              right: 'right' in item ? item.right : undefined,
              '--drift-duration': item.duration,
              '--drift-delay': item.delay,
            } as CSSProperties
          }
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}
