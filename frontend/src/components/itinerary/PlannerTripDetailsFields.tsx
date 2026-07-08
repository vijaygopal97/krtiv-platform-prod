'use client';

import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import {
  TRAVEL_SEASONS,
  detectOriginCityFromGeolocation,
  detectOriginCityFromIp,
  type TravelSeason,
} from '@/lib/plannerTripDetails';

type Variant = 'marketing' | 'dashboard';

type Props = {
  originCity: string;
  onOriginCityChange: (value: string) => void;
  travelSeason: TravelSeason | string;
  onTravelSeasonChange: (value: TravelSeason | string) => void;
  durationDays?: string;
  onDurationDaysChange?: (value: string) => void;
  showDuration?: boolean;
  variant?: Variant;
  /** Shown when city was auto-detected from IP on load */
  originAutoDetected?: boolean;
};

export default function PlannerTripDetailsFields({
  originCity,
  onOriginCityChange,
  travelSeason,
  onTravelSeasonChange,
  durationDays = '3',
  onDurationDaysChange,
  showDuration = false,
  variant = 'marketing',
  originAutoDetected = false,
}: Props) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const inputClass =
    variant === 'dashboard'
      ? 'mt-1 w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-[#C46B2D] bg-white'
      : 'w-full h-11 px-4 text-sm rounded-xl bg-white/90 border border-[color:var(--ink)]/15 outline-none focus:border-[color:var(--ink)] transition';

  const labelClass =
    variant === 'dashboard'
      ? 'text-xs font-medium text-[#6B7280]'
      : 'block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2';

  const handleDetectLocation = async () => {
    setLocError(null);
    setLocating(true);
    try {
      const city = await detectOriginCityFromGeolocation();
      onOriginCityChange(city);
    } catch {
      try {
        const city = await detectOriginCityFromIp();
        onOriginCityChange(city);
      } catch (e) {
        setLocError(e instanceof Error ? e.message : 'Could not detect location.');
      }
    } finally {
      setLocating(false);
    }
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${variant === 'marketing' ? 'mb-6' : ''}`}
    >
      <label className={`block ${showDuration ? '' : 'sm:col-span-2'}`}>
        <span className={labelClass}>Starting location</span>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={originCity}
            onChange={(e) => onOriginCityChange(e.target.value)}
            placeholder="e.g. Chennai, Delhi, Mumbai"
            className={`${inputClass} flex-1`}
            required
          />
          <button
            type="button"
            onClick={() => void handleDetectLocation()}
            disabled={locating}
            title="Use my location"
            className={
              variant === 'dashboard'
                ? 'shrink-0 h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#6B7280] hover:border-[#C46B2D] disabled:opacity-50'
                : 'shrink-0 h-11 px-3 rounded-xl border border-[color:var(--ink)]/15 text-xs font-medium text-[color:var(--ink-soft)] hover:border-[color:var(--saffron)] disabled:opacity-50'
            }
          >
            {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          </button>
        </div>
        {locError && <p className="text-xs text-red-600 mt-1">{locError}</p>}
        <p className={`text-xs mt-1 ${variant === 'dashboard' ? 'text-[#9CA3AF]' : 'text-[color:var(--ink-soft)]'}`}>
          {originAutoDetected
            ? 'Detected from your network — edit if needed. We plan travel from your city into Maharashtra and back.'
            : 'We plan travel from your city into Maharashtra and back.'}
        </p>
      </label>

      <label className="block">
        <span className={labelClass}>When are you travelling?</span>
        <select
          value={travelSeason}
          onChange={(e) => onTravelSeasonChange(e.target.value)}
          className={inputClass}
        >
          {TRAVEL_SEASONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      {showDuration && onDurationDaysChange && (
        <label className="block sm:col-span-2">
          <span className={labelClass}>Duration (days)</span>
          <input
            type="number"
            min={1}
            max={21}
            value={durationDays}
            onChange={(e) => onDurationDaysChange(e.target.value)}
            className={inputClass}
          />
        </label>
      )}
    </div>
  );
}
