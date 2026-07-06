'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSmartItineraryGeneration } from '@/hooks/useSmartItineraryGeneration';
import { buildSmartItineraryJobRequest } from '@/lib/smartItineraryPayload';
import GenerationProgress from '@/components/dashboard/GenerationProgress';
import SmartItineraryResult from '@/components/itinerary/SmartItineraryResult';
import { extractItineraryExtras } from '@/lib/itineraryExtras';
import { ShekruPlannerMascot, type MascotMode } from '@/components/planner/ShekruPlannerMascot';
import { PlannerConfetti } from '@/components/planner/PlannerConfetti';
import { usePlannerAmbient } from '@/components/planner/PlannerAmbientContext';
import { PlannerTravelIcon } from '@/components/planner/plannerTravelIconSvgs';
import { exploreChipIconId } from '@/lib/plannerTravelIcons';
import '@/styles/planner-interactions.css';

const EXPLORE_OPTIONS = [
  'Heritage',
  'Pilgrimage',
  'Adventure',
  'Culinary',
  'Art, Craft & Culture',
  'Urban & Contemporary',
  'Weddings',
] as const;

const TRAVEL_WITH = ['Solo', 'Couple', 'Family', 'Friends'] as const;

const DURATION_OPTIONS = ['1', '2', '3', '4', '5', '6'] as const;

const STEP_COUNT = 4;

function delay(ms: number) {
  return new Promise<void>((r) => window.setTimeout(r, ms));
}

type Ripple = { id: number; x: number; y: number };

function InterestChip({
  label,
  selected,
  index,
  onToggle,
}: {
  label: string;
  selected: boolean;
  index: number;
  onToggle: () => void;
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++rippleId.current;
    setRipples((r) => [...r, { id, x, y }]);
    window.setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 560);
    onToggle();
  };

  const iconId = exploreChipIconId(label);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={handleClick}
      className={`planner-interest-chip planner-stagger-item inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm border transition ${
        selected
          ? 'bg-[color:var(--ink)] text-white border-[color:var(--ink)]'
          : 'bg-[color:var(--ivory)] border hairline hover:border-[color:var(--saffron)] text-[color:var(--ink)]'
      }`}
      style={{ animationDelay: `${index * 55}ms` }}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="planner-chip-ripple"
          style={{ left: r.x, top: r.y, width: 48, height: 48, marginLeft: -24, marginTop: -24 }}
        />
      ))}
      <span
        className={`planner-interest-chip__icon ${selected ? 'planner-interest-chip__icon--selected' : ''}`}
        aria-hidden
      >
        <PlannerTravelIcon id={iconId} size={22} />
      </span>
      <span className="planner-interest-chip__label">{label}</span>
      {selected ? (
        <span className="planner-chip-check" aria-hidden>
          ✓
        </span>
      ) : null}
    </button>
  );
}

type Props = {
  onGenerated?: () => void;
};

export function AiTripPlannerWizard({ onGenerated }: Props) {
  const planner = useSmartItineraryGeneration('home');
  const { generating, progress, error, result, setError } = planner;
  const { setSelectedInterests, flashInterest } = usePlannerAmbient();

  const [step, setStep] = useState(0);
  const [progressPct, setProgressPct] = useState(25);
  const [interests, setInterests] = useState<string[]>([]);
  const [travelWith, setTravelWith] = useState<(typeof TRAVEL_WITH)[number]>('Family');
  const [days, setDays] = useState(3);
  const [tripName, setTripName] = useState('');
  const [savePrompt, setSavePrompt] = useState(false);

  const [mascotMode, setMascotMode] = useState<MascotMode>('idle');
  const [celebrateToken, setCelebrateToken] = useState(0);
  const [continuing, setContinuing] = useState(false);
  const [successBurst, setSuccessBurst] = useState(0);
  const [stepEnterKey, setStepEnterKey] = useState(0);

  const toggleInterest = (label: string) => {
    setInterests((prev) => {
      const adding = !prev.includes(label);
      if (adding) {
        setMascotMode('celebrate');
        setCelebrateToken((t) => t + 1);
        flashInterest(label);
        window.setTimeout(() => setMascotMode('idle'), 900);
      }
      const next = adding ? [...prev, label] : prev.filter((x) => x !== label);
      setSelectedInterests(next);
      return next;
    });
  };

  useEffect(() => {
    setSelectedInterests(interests);
  }, [interests, setSelectedInterests]);

  const advanceWithMascot = useCallback(async (nextStep: number, nextProgress: number) => {
    setMascotMode('walking');
    setContinuing(true);
    await delay(420);
    setProgressPct(nextProgress);
    setStep(nextStep);
    setStepEnterKey((k) => k + 1);
    setContinuing(false);
    setMascotMode('idle');
  }, []);

  useEffect(() => {
    if (generating) setMascotMode('walking');
    else if (!result) setMascotMode('idle');
  }, [generating, result]);

  useEffect(() => {
    if (result) {
      setSuccessBurst((b) => b + 1);
      setMascotMode('celebrate');
      setCelebrateToken((t) => t + 1);
    }
  }, [result]);

  const runPlanner = async () => {
    if (!tripName.trim()) {
      setError('Give your trip a name to continue.');
      return;
    }
    if (interests.length === 0) {
      setError('Select at least one experience to explore.');
      return;
    }
    setError(null);
    setSavePrompt(false);
    setProgressPct(100);
    setMascotMode('walking');

    const payload = buildSmartItineraryJobRequest({
      keywords: interests,
      context: 'home',
      durationDays: String(days >= 6 ? 6 : days),
      travelWith,
      tripName: tripName.trim(),
      exploreInterests: interests,
    });

    planner.setSelected(interests);
    await planner.runGenerate(interests, payload);
    setSavePrompt(true);
    onGenerated?.();
  };

  const extras = result ? extractItineraryExtras(result.raw) : null;

  if (result && extras) {
    return (
      <>
        <PlannerConfetti active burstKey={successBurst} />
        <ShekruPlannerMascot mode="celebrate" celebrateToken={successBurst} message="Your itinerary is ready!" />
        <div className="max-w-3xl mx-auto planner-result-reveal">
          <div className="planner-success-banner mb-6 text-center rounded-2xl border hairline bg-white/90 px-6 py-5">
            <p className="font-display text-xl text-[color:var(--ink)]">Journey planned!</p>
            <p className="text-sm text-[color:var(--ink-soft)] mt-1">Here is your personalized Maharashtra itinerary.</p>
          </div>
          <SmartItineraryResult
            title={result.title}
            parsed={result.parsed}
            rawText={result.raw}
            extras={extras}
            keywords={interests}
            categorySlug=""
            categoryFocus="Maharashtra Tourism"
            jobId={result.jobId}
          />
          {savePrompt && (
            <div className="mt-8 p-6 rounded-2xl border hairline bg-white text-center">
              <p className="font-display text-lg text-[color:var(--ink)]">Save your itinerary by creating an account</p>
              <p className="text-sm text-[color:var(--ink-soft)] mt-2 mb-4">
                Optional — you can keep using the planner without signing in.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="h-11 px-6 inline-flex items-center rounded-full bg-[color:var(--ink)] text-white text-sm"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="h-11 px-6 inline-flex items-center rounded-full border hairline text-sm"
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ShekruPlannerMascot mode={mascotMode} celebrateToken={celebrateToken} />
      <div className="max-w-2xl mx-auto planner-card-enter planner-card-float">
        <div className="mb-6 space-y-3">
          <div className="planner-progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="planner-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs tracking-[0.2em] uppercase text-[color:var(--ink-soft)]">
              Step {step + 1} of {STEP_COUNT}
            </p>
            <div className="flex gap-1.5" aria-hidden>
              {Array.from({ length: STEP_COUNT }, (_, i) => (
                <span
                  key={i}
                  className={`planner-step-dot ${i < step ? 'planner-step-dot--done' : ''} ${i === step ? 'planner-step-dot--active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="planner-form-card rounded-[20px] p-6 md:p-8">
          {step === 0 && (
            <fieldset key={`s0-${stepEnterKey}`} className="space-y-4 planner-fieldset-enter">
              <legend className="font-display text-xl mb-2">What would you like to explore in Maharashtra?</legend>
              <p className="text-sm text-[color:var(--ink-soft)] mb-4">Select all that apply.</p>
              <div className="flex flex-wrap gap-2">
                {EXPLORE_OPTIONS.map((opt, i) => (
                  <InterestChip
                    key={opt}
                    label={opt}
                    selected={interests.includes(opt)}
                    index={i}
                    onToggle={() => toggleInterest(opt)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset key={`s1-${stepEnterKey}`} className="space-y-4 planner-fieldset-enter">
              <legend className="font-display text-xl mb-4">Who are you travelling with?</legend>
              <div className="grid sm:grid-cols-2 gap-3">
                {TRAVEL_WITH.map((opt, i) => (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={travelWith === opt}
                    onClick={() => setTravelWith(opt)}
                    className="planner-stagger-item h-12 rounded-xl border text-sm font-medium transition bg-[color:var(--ivory)] hairline hover:border-[color:var(--ink)] data-[on=true]:bg-[color:var(--ink)] data-[on=true]:text-white"
                    style={{ animationDelay: `${i * 60}ms` }}
                    data-on={travelWith === opt ? 'true' : 'false'}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset key={`s2-${stepEnterKey}`} className="space-y-4 planner-fieldset-enter">
              <legend className="font-display text-xl mb-4">How many days are you planning to travel?</legend>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  aria-label="Decrease days"
                  className="w-12 h-12 rounded-full border hairline text-xl"
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                >
                  −
                </button>
                <span className="font-display text-3xl min-w-[4rem] text-center">
                  {days >= 6 ? '6+' : days}{' '}
                  <span className="text-base font-body text-[color:var(--ink-soft)]">days</span>
                </span>
                <button
                  type="button"
                  aria-label="Increase days"
                  className="w-12 h-12 rounded-full border hairline text-xl"
                  onClick={() => setDays((d) => Math.min(6, d + 1))}
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(Number(d))}
                    className={`px-3 py-1.5 rounded-full text-xs border ${
                      (d === '6' ? days >= 6 : days === Number(d))
                        ? 'bg-[color:var(--saffron)] border-[color:var(--saffron)]'
                        : 'hairline'
                    }`}
                  >
                    {d === '6' ? '6+ Days' : `${d} Day${d === '1' ? '' : 's'}`}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset key={`s3-${stepEnterKey}`} className="space-y-4 planner-fieldset-enter">
              <legend className="font-display text-xl mb-2">Give your trip a name</legend>
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="e.g. Monsoon Escape, Heritage Trail"
                className="w-full h-12 px-4 rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)]"
              />
            </fieldset>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
              {error}
            </p>
          )}

          {generating && (
            <div className="mt-8">
              <GenerationProgress progress={progress} />
            </div>
          )}

          {!generating && (
            <div className="mt-8 flex flex-wrap gap-3 justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  className="h-11 px-5 rounded-full border hairline text-sm"
                  onClick={() => {
                    setStep((s) => {
                      const next = s - 1;
                      setProgressPct((next + 1) * 25);
                      setStepEnterKey((k) => k + 1);
                      return next;
                    });
                  }}
                  disabled={continuing}
                >
                  Back
                </button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <button
                  type="button"
                  disabled={continuing}
                  className="planner-btn-continue h-11 px-6 rounded-full bg-[color:var(--ink)] text-white text-sm ml-auto inline-flex items-center justify-center gap-2 min-w-[8.5rem]"
                  onClick={() => {
                    if (step === 0 && interests.length === 0) {
                      setError('Select at least one experience.');
                      return;
                    }
                    setError(null);
                    void advanceWithMascot(step + 1, (step + 2) * 25);
                  }}
                >
                  {continuing ? <span className="planner-btn-spinner" aria-hidden /> : null}
                  {continuing ? 'Loading…' : 'Continue'}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={continuing || generating}
                  className="planner-btn-continue h-11 px-6 rounded-full bg-[color:var(--saffron)] text-[color:var(--ink)] font-semibold text-sm ml-auto inline-flex items-center gap-2"
                  onClick={() => void runPlanner()}
                >
                  {generating ? <span className="planner-btn-spinner border-[color:var(--ink)]/30 border-t-[color:var(--ink)]" aria-hidden /> : null}
                  Generate itinerary
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
