'use client';

import { useState } from 'react';
import { MapPin, Route, Sparkles } from 'lucide-react';
import type { ItineraryJobRequest } from '@/lib/signpostApi';
import type { SavedPlaceMeta } from '@/lib/savePlaceSlug';
import { optimizeRouteOrder } from '@/lib/routeOptimizeSavedPlaces';

type Props = {
  places: SavedPlaceMeta[];
  onGenerate: (payload: ItineraryJobRequest) => void;
  disabled?: boolean;
};

export default function SavedPlacesRoutePlanner({ places, onGenerate, disabled }: Props) {
  const [originCity, setOriginCity] = useState('Mumbai');
  const [durationDays, setDurationDays] = useState(String(Math.max(3, places.length)));

  if (places.length < 2) return null;

  const handlePlan = () => {
    const ordered = optimizeRouteOrder(originCity, places);
    const labels = ordered.map((s) => s.label);
    const payload: ItineraryJobRequest = {
      title: `Saved places route from ${originCity.trim() || 'Mumbai'}`,
      userProfile: {
        age: '30',
        interestCategory: ['Culture', 'Nature', 'Food'],
        travelWith: 'Family',
        originCity: originCity.trim() || 'Mumbai',
        durationDays: durationDays.trim() || String(Math.max(3, places.length)),
        preferredLocations: labels,
        tourismKeywords: ['route optimized', 'multi-stop', 'saved places'],
        categoryFocus: 'Saved Places Route',
      },
    };
    onGenerate(payload);
  };

  const preview = optimizeRouteOrder(originCity, places).map((s) => s.label);

  return (
    <section className="travel-dash-card p-6 md:p-8 mb-6 border border-[#C46B2D]/20 bg-gradient-to-br from-[#C46B2D]/5 to-white">
      <div className="flex items-start gap-3 mb-4">
        <span className="w-11 h-11 rounded-2xl bg-[#C46B2D]/15 text-[#C46B2D] grid place-items-center shrink-0">
          <Route className="w-5 h-5" />
        </span>
        <div>
          <h2 className="font-display-dash text-lg font-semibold text-[#1F2937]">Plan route from saved places</h2>
          <p className="text-sm text-[#6B7280] mt-1">
            AI builds a multi-stop itinerary with stops ordered for efficient travel from your starting city.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="saved-route-origin" className="block text-xs font-medium text-[#6B7280] mb-1.5">
            Starting location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              id="saved-route-origin"
              type="text"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              placeholder="Mumbai"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:border-[#C46B2D]"
            />
          </div>
        </div>
        <div>
          <label htmlFor="saved-route-days" className="block text-xs font-medium text-[#6B7280] mb-1.5">
            Trip duration (days)
          </label>
          <input
            id="saved-route-days"
            type="number"
            min={2}
            max={21}
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:border-[#C46B2D]"
          />
        </div>
      </div>

      <p className="text-xs text-[#6B7280] mb-4">
        Optimized order: {preview.join(' → ')}
      </p>

      <button
        type="button"
        disabled={disabled || places.length < 2}
        onClick={handlePlan}
        className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#C46B2D] text-white text-sm font-semibold hover:brightness-105 disabled:opacity-50 transition-all"
      >
        <Sparkles className="w-4 h-4" />
        Generate AI itinerary
      </button>
    </section>
  );
}
