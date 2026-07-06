'use client';

import type { SavedItineraryRecord } from '@/lib/myItinerariesApi';
import TripCard from './TripCard';

type Props = {
  items: SavedItineraryRecord[];
  loading?: boolean;
  onContinue: (id: string) => void;
  onOpenSaved: () => void;
};

export default function ContinueYourTrips({ items, loading, onContinue, onOpenSaved }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display-dash text-lg font-semibold text-[#1F2937]">Continue Your Trips</h2>
        <button type="button" onClick={onOpenSaved} className="text-xs font-semibold text-[#C46B2D] hover:underline">
          View all
        </button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 travel-dash-skeleton rounded-[20px]" />
          ))}
        </div>
      ) : !items.length ? (
        <div className="travel-dash-card p-8 text-center text-sm text-[#6B7280]">
          No trips yet. Use Create Trip or the AI Planner to generate your first itinerary.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.slice(0, 4).map((item, i) => (
            <TripCard key={item._id} item={item} index={i} onContinue={onContinue} onMenu={() => onOpenSaved()} />
          ))}
        </div>
      )}
    </section>
  );
}
