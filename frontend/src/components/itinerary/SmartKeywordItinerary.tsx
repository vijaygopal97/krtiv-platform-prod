'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  keywordsForContext,
  sectionIdForPlannerContext,
  displayLabelForKeyword,
  type KeywordContext,
} from '@/lib/itineraryKeywords';
import { buildSmartItineraryJobRequest } from '@/lib/smartItineraryPayload';
import { startItineraryJob, pollJob, getCategoryApiName } from '@/lib/signpostApi';
import { parseItineraryText } from '@/lib/parseItinerary';
import { extractItineraryExtras } from '@/lib/itineraryExtras';
import { trackKeywordGeneration } from '@/lib/plannerApi';
import GenerationProgress from '@/components/dashboard/GenerationProgress';
import SmartItineraryResult from '@/components/itinerary/SmartItineraryResult';
import { authService } from '@/services/authService';

const POLL_MS = 2500;

type Props = {
  context: KeywordContext;
  heading?: string;
  subheading?: string;
  className?: string;
  compact?: boolean;
  /** Override default section anchor id (e.g. place-smart-itinerary). */
  sectionId?: string;
  /** Places to Go — destination-specific interest chips */
  placeSlug?: string;
  placeTitle?: string;
  /** Hides marketing hero — use inside logged-in dashboard */
  dashboardMode?: boolean;
};

export default function SmartKeywordItinerary({
  context,
  heading = 'Build your trip in one tap',
  subheading = 'Pick what excites you — our AI planner shapes a day-by-day Maharashtra itinerary.',
  className = '',
  compact = false,
  sectionId: sectionIdOverride,
  placeSlug,
  placeTitle,
  dashboardMode = false,
}: Props) {
  const sectionId = sectionIdOverride ?? sectionIdForPlannerContext(context);
  const router = useRouter();
  const keywords = useMemo(() => keywordsForContext(context, placeSlug), [context, placeSlug]);
  const [selected, setSelected] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(authService.isAuthenticated());
  }, []);

  const [result, setResult] = useState<{
    title: string;
    parsed: ReturnType<typeof parseItineraryText>;
    raw: string;
    jobId?: string;
  } | null>(null);

  const categoryFocus =
    placeTitle
      ? `${placeTitle} · Maharashtra`
      : context === 'explore'
        ? 'Explore Maharashtra'
        : context === 'home'
          ? 'Maharashtra Tourism'
          : getCategoryApiName(context) || 'Maharashtra Tourism';

  const resultRef = useRef<HTMLDivElement | null>(null);

  const toggle = (kw: string) => {
    setSelected((prev) => (prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]));
  };

  const runGenerate = useCallback(async () => {
    if (selected.length === 0) {
      setError('Select at least one interest tag.');
      return;
    }
    setError(null);
    setResult(null);
    setGenerating(true);
    setProgress(12);

    void trackKeywordGeneration({
      keywords: selected,
      categoryFocus,
      categorySlug: context === 'home' ? '' : context,
    });

    const plannerSection = document.getElementById(sectionId);
    plannerSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const payload = buildSmartItineraryJobRequest({
      keywords: selected,
      context,
      placeSlug,
      placeTitle,
    });
    const startRes = await startItineraryJob(payload);
    if (!startRes?.jobId) {
      setError('Could not start AI planner. Please try again.');
      setGenerating(false);
      return;
    }

    const jobId = startRes.jobId;
    const poll = async (): Promise<void> => {
      const pollRes = await pollJob(jobId);
      if (!pollRes) {
        setProgress((p) => Math.min(p + 10, 88));
        setTimeout(poll, POLL_MS);
        return;
      }
      if (pollRes.status === 'pending' || pollRes.status === 'running') {
        setProgress((p) => Math.min(p + 12, 88));
        setTimeout(poll, POLL_MS);
        return;
      }
      if (pollRes.status === 'failed') {
        setError(pollRes.error || 'Generation failed.');
        setGenerating(false);
        return;
      }
      if (pollRes.status === 'completed' && pollRes.result?.itinerary) {
        setProgress(100);
        try {
          const parsed = parseItineraryText(pollRes.result.itinerary);
          setResult({
            title: pollRes.result.title || payload.title || 'Your itinerary',
            parsed,
            raw: pollRes.result.itinerary,
            jobId,
          });
          requestAnimationFrame(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        } catch {
          setError('Could not read itinerary format. Please try again.');
        }
        setGenerating(false);
        return;
      }
      setTimeout(poll, POLL_MS);
    };
    setTimeout(poll, POLL_MS);
  }, [selected, context, categoryFocus, placeSlug, placeTitle, sectionId]);

  const extras = result ? extractItineraryExtras(result.raw) : null;

  return (
    <section
      id={sectionId}
      className={`${dashboardMode ? 'py-6 px-0' : compact ? 'py-12' : 'py-16 md:py-24'} ${dashboardMode ? '' : 'px-4 md:px-8'} scroll-mt-24 ${className}`}
    >
      <div className={dashboardMode ? 'max-w-3xl' : 'max-w-4xl mx-auto'}>
        {!dashboardMode && (
          <div className="text-center mb-8 md:mb-10">
            <p className="eyebrow text-[color:var(--saffron)]">Smart AI planner</p>
            <h2 className="font-display text-3xl md:text-4xl mt-3 text-[color:var(--ink)] text-balance">{heading}</h2>
            <p className="lede mt-3 text-[color:var(--ink-soft)] max-w-2xl mx-auto">{subheading}</p>
          </div>
        )}

        {dashboardMode && (
          <div className="mb-4">
            <h2 className="font-display-dash text-lg font-semibold text-[#1F2937]">Smart tag planner</h2>
            <p className="text-sm text-[#6B7280] mt-1">Select interests and generate without leaving your dashboard.</p>
          </div>
        )}

        <div className={`flex flex-wrap gap-2 md:gap-3 mb-8 ${dashboardMode ? 'justify-start' : 'justify-center'}`}>
          {keywords.map((kw) => {
            const active = selected.includes(kw);
            const label = displayLabelForKeyword(context, kw, placeSlug);
            return (
              <button
                key={kw}
                type="button"
                onClick={() => toggle(kw)}
                className={`keyword-chip px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 transform hover:scale-[1.03] active:scale-95 ${
                  active
                    ? 'bg-[color:var(--ink)] text-white border-[color:var(--ink)] shadow-lg'
                    : 'bg-white/90 text-[color:var(--ink)] border-[color:var(--ink)]/15 hover:border-[color:var(--saffron)]/50'
                }`}
                aria-pressed={active}
              >
                {active ? '✓ ' : ''}
                {label}
              </button>
            );
          })}
        </div>

        <div className={`flex flex-col sm:flex-row items-center gap-3 ${dashboardMode ? 'justify-start' : 'justify-center'}`}>
          <button
            type="button"
            onClick={() => void runGenerate()}
            disabled={generating || selected.length === 0}
            className={`h-11 px-6 rounded-xl font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] ${
              dashboardMode
                ? 'bg-[#C46B2D] text-white hover:brightness-105'
                : 'h-12 px-8 rounded-full bg-[color:var(--saffron)] text-[color:var(--ink)] shadow-lg shadow-orange-500/20 hover:brightness-105'
            }`}
          >
            {generating ? 'Generating…' : dashboardMode ? 'Generate plan' : 'Generate My Itinerary'}
          </button>
          {!loggedIn && (
            <p className="text-xs text-[color:var(--ink-soft)] text-center">
              No account needed to generate.{' '}
              <Link href="/register" className="underline underline-offset-2">
                Create an account
              </Link>{' '}
              to save your itinerary later.
            </p>
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm text-center">{error}</div>
        )}

        {generating && (
          <div className="mt-10 flex justify-center">
            <GenerationProgress progress={progress} />
          </div>
        )}

        {result && extras && (
          <div ref={resultRef} className="mt-12 scroll-mt-24">
            <SmartItineraryResult
              title={result.title}
              parsed={result.parsed}
              rawText={result.raw}
              extras={extras}
              keywords={selected}
              categorySlug={context === 'home' ? '' : context}
              categoryFocus={categoryFocus}
              jobId={result.jobId}
            />
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => router.push('/explore#explore-smart-planner')}
                className="text-sm text-[color:var(--ink)] underline underline-offset-4"
              >
                Open planner
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
