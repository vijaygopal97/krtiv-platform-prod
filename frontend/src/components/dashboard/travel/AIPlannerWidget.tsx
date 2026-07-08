'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { ItineraryJobRequest } from '@/lib/signpostApi';
import PlannerTripDetailsFields from '@/components/itinerary/PlannerTripDetailsFields';
import { buildPlannerLogisticsKeywords } from '@/lib/plannerTripDetails';
import { useAutoPlannerOrigin } from '@/hooks/useAutoPlannerOrigin';

export type PlannerPrefill = {
  destination: string;
  travelStyle?: string;
  autoGenerate?: boolean;
  /** Bumps when a new prefill is requested */
  nonce: number;
};

type Props = {
  onGenerate: (payload: ItineraryJobRequest) => void;
  disabled?: boolean;
  prefill?: PlannerPrefill | null;
};

const STYLES = ['Relaxed', 'Adventure', 'Cultural', 'Family', 'Luxury', 'Nature', 'Spiritual', 'Urban'] as const;

const STYLE_TO_CATEGORY: Record<(typeof STYLES)[number], string> = {
  Relaxed: 'Maharashtra Tourism',
  Adventure: 'Adventure & Ecotourism',
  Cultural: 'Historical & Heritage',
  Family: 'Maharashtra Tourism',
  Luxury: 'Urban & Contemporary',
  Nature: 'Adventure & Ecotourism',
  Spiritual: 'Spiritual & Pilgrimage',
  Urban: 'Urban & Contemporary',
};

function buildPayload(
  dest: string,
  days: string,
  budget: string,
  style: (typeof STYLES)[number],
  originCity: string,
  travelSeason: string,
): ItineraryJobRequest {
  const category = STYLE_TO_CATEGORY[style] || 'Maharashtra Tourism';
  const logisticsKeywords = buildPlannerLogisticsKeywords({
    originCity: originCity.trim() || 'Mumbai',
    travelSeason,
    durationDays: days,
  });
  return {
    title: `${dest} — ${days} day trip`,
    userProfile: {
      age: '30',
      interestCategory: [category],
      travelWith: style === 'Family' ? 'Family' : style === 'Spiritual' ? 'Family' : 'Friends',
      originCity: originCity.trim() || 'Mumbai',
      durationDays: days,
      travelSeason,
      preferredLocations: [dest],
      tourismKeywords: [
        `Primary theme: ${category}`,
        `Destination focus: ${dest}`,
        `Travel style: ${style}`,
        `Budget: ${budget}`,
        `STRICT THEME: Every day must stay within ${category} — no unrelated activities on later days`,
        ...logisticsKeywords,
      ],
      categoryFocus: `${category} — ${dest}`,
    },
  };
}

export default function AIPlannerWidget({ onGenerate, disabled, prefill }: Props) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('4');
  const [budget, setBudget] = useState('Moderate');
  const [style, setStyle] = useState('Relaxed');
  const { originCity, setOriginCity, travelSeason, setTravelSeason, originFromIp } = useAutoPlannerOrigin();
  const lastNonce = useRef(0);
  const onGenerateRef = useRef(onGenerate);
  onGenerateRef.current = onGenerate;

  useEffect(() => {
    if (!prefill?.nonce || prefill.nonce === lastNonce.current) return;
    lastNonce.current = prefill.nonce;
    const dest = prefill.destination;
    const travelStyle = prefill.travelStyle || 'Nature';
    if (dest) setDestination(dest);
    setStyle(travelStyle);
    if (prefill.autoGenerate && dest) {
      const styleKey = (STYLES as readonly string[]).includes(travelStyle)
        ? (travelStyle as (typeof STYLES)[number])
        : 'Nature';
      onGenerateRef.current(buildPayload(dest, days, budget, styleKey, originCity, travelSeason));
    }
  }, [prefill, days, budget, originCity, travelSeason]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dest = destination.trim() || 'Maharashtra';
    onGenerate(buildPayload(dest, days, budget, style as (typeof STYLES)[number], originCity, travelSeason));
  };

  return (
    <section id="dash-ai-planner" className="travel-dash-card p-5 md:p-6 scroll-mt-24">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-9 h-9 rounded-xl bg-[#C46B2D]/10 text-[#C46B2D] grid place-items-center">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <h2 className="font-display-dash text-lg font-semibold text-[#1F2937]">AI Planner</h2>
          <p className="text-xs text-[#6B7280]">Compact trip generator</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-[#6B7280]">Destination</span>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Mahabaleshwar"
            className="mt-1 w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-[#C46B2D]"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-[#6B7280]">Travel Days</span>
          <input
            type="number"
            min={1}
            max={14}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-[#C46B2D]"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-[#6B7280]">Budget</span>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-[#C46B2D] bg-white"
          >
            <option>Budget</option>
            <option>Moderate</option>
            <option>Premium</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-[#6B7280]">Travel Style</span>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-[#C46B2D] bg-white"
          >
            {STYLES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <PlannerTripDetailsFields
          originCity={originCity}
          onOriginCityChange={setOriginCity}
          travelSeason={travelSeason}
          onTravelSeasonChange={setTravelSeason}
          variant="dashboard"
          originAutoDetected={originFromIp}
        />
        <button
          type="submit"
          disabled={disabled}
          className="sm:col-span-2 h-11 rounded-xl bg-[#C46B2D] text-white text-sm font-semibold hover:brightness-105 disabled:opacity-50 transition-all duration-250"
        >
          Generate Plan
        </button>
      </form>
    </section>
  );
}
