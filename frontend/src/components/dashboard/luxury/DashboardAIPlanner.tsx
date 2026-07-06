'use client';

import { motion } from 'framer-motion';
import type { ItineraryJobRequest } from '@/lib/signpostApi';
import { Loader2 } from 'lucide-react';

type Props = {
  onSubmit: (payload: ItineraryJobRequest) => void;
  disabled?: boolean;
  initialDestination?: string;
  initialStyle?: string;
};

export function DashboardAIPlanner({ onSubmit, disabled, initialDestination, initialStyle }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const destination = String(fd.get('destination') || '').trim() || 'Maharashtra';
    const duration = String(fd.get('duration') || '3').trim();
    const travelers = String(fd.get('travelers') || 'Family').trim();
    const budget = String(fd.get('budget') || 'Moderate').trim();
    const style = String(fd.get('style') || initialStyle || 'Heritage, Nature').trim();
    const origin = String(fd.get('origin') || 'Mumbai').trim();
    const dateNote = String(fd.get('travelDate') || '').trim();

    const title = dateNote
      ? `${destination} — ${dateNote}`
      : `${destination} Journey`;

    const payload: ItineraryJobRequest = {
      title,
      userProfile: {
        age: '30',
        interestCategory: `${style}, ${budget}`.split(',').map((s) => s.trim()).filter(Boolean),
        travelWith: travelers,
        originCity: origin,
        durationDays: duration,
        preferredLocations: destination.split(',').map((s) => s.trim()).filter(Boolean),
      },
    };
    onSubmit(payload);
  };

  return (
    <motion.div
      className="lux-glass-planner rounded-3xl p-6 md:p-8 -mt-8 md:-mt-12 mx-4 sm:mx-6 lg:mx-10 relative z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <h2 className="font-display-lux text-2xl md:text-3xl text-[color:var(--lux-text)]">
        Build Your Perfect Maharashtra Journey
      </h2>
      <p className="text-sm text-[color:var(--lux-muted)] mt-2 mb-6">
        Tell us where you want to go — we&apos;ll craft a day-by-day itinerary with AI.
      </p>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Destination" name="destination" defaultValue={initialDestination} placeholder="Lonavala, Konkan…" />
        <Field label="Travel date" name="travelDate" type="date" />
        <Field label="Duration (days)" name="duration" defaultValue="3" type="number" min={1} max={30} />
        <Field label="Travelers" name="travelers" defaultValue="Family" placeholder="Family, Solo…" />
        <Field label="Budget" name="budget" defaultValue="Moderate" placeholder="Budget, Luxury…" />
        <Field label="Trip style" name="style" defaultValue={initialStyle || 'Heritage, Food'} />
        <Field label="Origin city" name="origin" defaultValue="Mumbai" className="sm:col-span-2 lg:col-span-1" />
        <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
          <button type="submit" disabled={disabled} className="lux-btn-primary h-12 px-8 inline-flex items-center gap-2 text-sm">
            {disabled ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating…
              </>
            ) : (
              <>Generate My Itinerary →</>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = 'text',
  min,
  max,
  className = '',
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-[color:var(--lux-muted)] uppercase tracking-wider">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        max={max}
        required={name === 'destination' || name === 'duration'}
        className="mt-1.5 w-full h-11 px-4 rounded-xl border border-[color:var(--lux-border)] bg-[color:var(--lux-card)] text-sm outline-none focus:border-[color:var(--lux-primary)] focus:ring-2 focus:ring-[color:var(--lux-primary)]/20"
      />
    </label>
  );
}
