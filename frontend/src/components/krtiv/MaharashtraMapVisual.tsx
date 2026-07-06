'use client';

import { useMemo } from 'react';
import type { CategoryItinerary } from './data';
import { getItineraryGeoPoints } from './maharashtraMapUtils';
import { ItineraryRouteMap } from './ItineraryRouteMap';

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
  const points = useMemo(() => getItineraryGeoPoints(itinerary), [itinerary]);

  if (points.length === 0) {
    return (
      <div
        id={id}
        className={`relative rounded-[20px] overflow-hidden border hairline bg-[color:var(--bone)] flex items-center justify-center ${aspectClassName} ${className}`}
        role="img"
        aria-label="Map unavailable for this itinerary"
      >
        <p className="text-sm text-[color:var(--ink-soft)] px-6 text-center">
          Map locations could not be resolved for this itinerary.
        </p>
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`relative rounded-[20px] overflow-hidden border hairline bg-[color:var(--map-water)] shadow-[0_40px_120px_-70px_rgba(47,71,62,0.65)] ${aspectClassName} ${className}`}
      role="region"
      aria-label="Interactive map of Maharashtra with itinerary stops"
    >
      <ItineraryRouteMap
        points={points}
        activeDay={activeDay}
        onActiveDayChange={onActiveDayChange}
      />
      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/70 backdrop-blur flex items-center justify-center text-[10px] tracking-widest text-[color:var(--ink-soft)] border hairline pointer-events-none z-[600]">
        N
      </div>
    </div>
  );
}
