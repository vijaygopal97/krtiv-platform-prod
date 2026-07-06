'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import '@/styles/planner-travel-ambient.css';

const PlannerTravelAmbient = dynamic(
  () =>
    import('@/components/planner/PlannerTravelAmbient').then((mod) => ({
      default: mod.PlannerTravelAmbient,
    })),
  { ssr: false },
);

const AMBIENT_ROOT_ID = 'curated-trail-ambient-root';

type Props = {
  children: ReactNode;
};

/** Contact-page-style travel ambient for curated trail index pages. */
export function CuratedTrailAmbientShell({ children }: Props) {
  return (
    <main
      id={AMBIENT_ROOT_ID}
      className="relative planner-section-premium text-[color:var(--ink)] overflow-hidden"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
        <PlannerTravelAmbient observeRootSelector={`#${AMBIENT_ROOT_ID}`} />
      </div>
      <div className="relative z-[1]">{children}</div>
    </main>
  );
}
