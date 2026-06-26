'use client';

import { useCallback, useState } from 'react';
import { buildSmartItineraryJobRequest } from '@/lib/smartItineraryPayload';
import { startItineraryJob, pollJob, getCategoryApiName } from '@/lib/signpostApi';
import { parseItineraryText } from '@/lib/parseItinerary';
import { trackKeywordGeneration } from '@/lib/plannerApi';
import type { KeywordContext } from '@/lib/itineraryKeywords';

const POLL_MS = 2500;

export function useSmartItineraryGeneration(context: KeywordContext) {
  const [selected, setSelected] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    title: string;
    parsed: ReturnType<typeof parseItineraryText>;
    raw: string;
    jobId?: string;
  } | null>(null);

  const categoryFocus =
    context === 'explore'
      ? 'Explore Maharashtra'
      : context === 'home'
        ? 'Maharashtra Tourism'
        : getCategoryApiName(context) || 'Maharashtra Tourism';

  const toggle = useCallback((kw: string) => {
    setSelected((prev) => (prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]));
  }, []);

  const runGenerate = useCallback(
    async (keywordsOverride?: string[], payloadOverride?: ReturnType<typeof buildSmartItineraryJobRequest>) => {
      const keywords = keywordsOverride?.length ? keywordsOverride : selected;
      if (keywords.length === 0) {
        setError('Select at least one interest tag.');
        return;
      }
      setError(null);
      setResult(null);
      setGenerating(true);
      setProgress(12);

      void trackKeywordGeneration({
        keywords,
        categoryFocus,
        categorySlug: context === 'home' ? '' : context,
      });

      const payload = payloadOverride ?? buildSmartItineraryJobRequest({ keywords, context });
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
          } catch {
            setError('Could not read itinerary format. Please try again.');
          }
          setGenerating(false);
          return;
        }
        setTimeout(poll, POLL_MS);
      };
      setTimeout(poll, POLL_MS);
    },
    [selected, context, categoryFocus]
  );

  return {
    selected,
    setSelected,
    toggle,
    generating,
    progress,
    error,
    setError,
    result,
    categoryFocus,
    runGenerate,
  };
}
