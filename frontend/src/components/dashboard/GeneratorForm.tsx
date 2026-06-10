'use client';

import type { ItineraryJobRequest } from '@/lib/signpostApi';

interface GeneratorFormProps {
  onSubmit: (payload: ItineraryJobRequest) => void;
  disabled?: boolean;
  initialTitle?: string;
  initialAge?: string;
  initialInterests?: string;
  initialTravelWith?: string;
  initialDuration?: string;
  initialOrigin?: string;
  initialLocations?: string;
}

export default function GeneratorForm({
  onSubmit,
  disabled = false,
  initialTitle = '',
  initialAge = '',
  initialInterests = 'Culinary, Rural',
  initialTravelWith = 'Family',
  initialDuration = '3',
  initialOrigin = 'Mumbai',
  initialLocations = '',
}: GeneratorFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.querySelector('[name="title"]') as HTMLInputElement)?.value?.trim() || 'My Maharashtra Itinerary';
    const age = (form.querySelector('[name="age"]') as HTMLInputElement)?.value?.trim() || '28';
    const interests = (form.querySelector('[name="interestCategory"]') as HTMLInputElement)?.value?.trim() || 'Culinary, Rural';
    const travelWith = (form.querySelector('[name="travelWith"]') as HTMLInputElement)?.value?.trim() || 'Family';
    const durationDays = (form.querySelector('[name="durationDays"]') as HTMLInputElement)?.value?.trim() || '3';
    const originCity = (form.querySelector('[name="originCity"]') as HTMLInputElement)?.value?.trim() || 'Mumbai';
    const preferredLocations = (form.querySelector('[name="preferredLocations"]') as HTMLInputElement)?.value?.trim() || '';

    const payload: ItineraryJobRequest = {
      title,
      userProfile: {
        age,
        interestCategory: interests.split(',').map((s) => s.trim()).filter(Boolean),
        travelWith,
        originCity,
        durationDays,
        preferredLocations: preferredLocations.split(',').map((s) => s.trim()).filter(Boolean),
      },
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Title (optional)</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={initialTitle}
          placeholder="My Maharashtra Trip"
          className="w-full h-11 px-4 text-sm rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition"
        />
      </div>
      <div>
        <label htmlFor="age" className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          required
          min={1}
          max={120}
          defaultValue={initialAge}
          placeholder="28"
          className="w-full h-11 px-4 text-sm rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition"
        />
      </div>
      <div>
        <label htmlFor="interestCategory" className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Interests</label>
        <input
          type="text"
          id="interestCategory"
          name="interestCategory"
          required
          defaultValue={initialInterests}
          placeholder="Culinary, Rural, Adventure"
          className="w-full h-11 px-4 text-sm rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition"
        />
        <p className="text-xs text-[color:var(--ink-soft)] mt-1">Comma-separated (e.g. Culinary, Rural, Spiritual)</p>
      </div>
      <div>
        <label htmlFor="travelWith" className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Traveling with</label>
        <input
          type="text"
          id="travelWith"
          name="travelWith"
          required
          defaultValue={initialTravelWith}
          placeholder="Family, Friends, Solo"
          className="w-full h-11 px-4 text-sm rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition"
        />
      </div>
      <div>
        <label htmlFor="durationDays" className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Duration (days)</label>
        <input
          type="number"
          id="durationDays"
          name="durationDays"
          required
          min={1}
          max={30}
          defaultValue={initialDuration}
          placeholder="3"
          className="w-full h-11 px-4 text-sm rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition"
        />
      </div>
      <div>
        <label htmlFor="originCity" className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Origin city</label>
        <input
          type="text"
          id="originCity"
          name="originCity"
          required
          defaultValue={initialOrigin}
          placeholder="Mumbai"
          className="w-full h-11 px-4 text-sm rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition"
        />
      </div>
      <div>
        <label htmlFor="preferredLocations" className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Preferred locations (optional)</label>
        <input
          type="text"
          id="preferredLocations"
          name="preferredLocations"
          defaultValue={initialLocations}
          placeholder="Lonavala, Mahabaleshwar"
          className="w-full h-11 px-4 text-sm rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition"
        />
        <p className="text-xs text-[color:var(--ink-soft)] mt-1">Comma-separated places you want to include</p>
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="w-full h-12 rounded-full bg-[color:var(--ink)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? 'Generating…' : 'Generate Itinerary'}
      </button>
    </form>
  );
}
