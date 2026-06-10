'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { startItineraryJob, pollJob, type ItineraryJobRequest } from '@/lib/signpostApi';
import { parseItineraryText } from '@/lib/parseItinerary';
import GeneratorForm from '@/components/dashboard/GeneratorForm';
import GenerationProgress from '@/components/dashboard/GenerationProgress';
import CompactItineraryView from '@/components/dashboard/CompactItineraryView';
import { krtivLogo } from '@/lib/krtivPaths';

const POLL_INTERVAL_MS = 2500;

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    title: string;
    parsed: ReturnType<typeof parseItineraryText>;
  } | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser({ name: currentUser.name, email: currentUser.email });
  }, [router]);

  const handleGenerate = async (payload: ItineraryJobRequest) => {
    setError(null);
    setResult(null);
    setIsGenerating(true);
    setProgress(10);

    const startRes = await startItineraryJob(payload);
    if (!startRes?.jobId) {
      setError('Could not start itinerary. Please try again.');
      setIsGenerating(false);
      return;
    }

    setProgress(25);
    const jobId = startRes.jobId;

    const poll = async (): Promise<void> => {
      const pollRes = await pollJob(jobId);
      if (!pollRes) {
        setProgress((p) => Math.min(p + 15, 90));
        setTimeout(poll, POLL_INTERVAL_MS);
        return;
      }

      if (pollRes.status === 'running' || pollRes.status === 'pending') {
        setProgress((p) => Math.min(p + 12, 85));
        setTimeout(poll, POLL_INTERVAL_MS);
        return;
      }

      if (pollRes.status === 'failed') {
        setError(pollRes.error || 'Itinerary generation failed. Please try again.');
        setIsGenerating(false);
        return;
      }

      if (pollRes.status === 'completed' && pollRes.result?.itinerary) {
        setProgress(100);
        try {
          const parsed = parseItineraryText(pollRes.result.itinerary);
          if (parsed.days?.length) {
            setResult({
              title: pollRes.result.title || payload.title || 'Generated Itinerary',
              parsed,
            });
          } else {
            setError('Itinerary returned no days. Please try again.');
          }
        } catch {
          setError('Could not parse itinerary. Please try again.');
        }
        setIsGenerating(false);
        return;
      }

      setProgress((p) => Math.min(p + 10, 90));
      setTimeout(poll, POLL_INTERVAL_MS);
    };

    setTimeout(poll, POLL_INTERVAL_MS);
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[color:var(--ivory)]">
        <p className="text-[color:var(--ink-soft)] animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--ivory)] text-[color:var(--ink)] md:h-screen md:overflow-hidden">
      <header className="flex-shrink-0 frosted border-b hairline px-5 md:px-10 h-16 md:h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          <img src={krtivLogo()} alt="" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
          <span className="hidden sm:inline text-[color:var(--ink-soft)] text-sm">Itinerary Builder</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[color:var(--ink-soft)] hidden sm:inline">{user.name}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm px-4 h-9 rounded-full border hairline hover:bg-[color:var(--bone)] transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row md:flex-1 md:min-h-0">
        <aside className="w-full md:w-[24rem] flex-shrink-0 border-b md:border-b-0 md:border-r hairline bg-white md:overflow-y-auto">
          <div className="p-6 md:p-8">
            <p className="eyebrow">AI planner</p>
            <h2 className="font-display text-2xl mt-2">Plan your journey</h2>
            <p className="text-sm text-[color:var(--ink-soft)] mt-2 mb-6">
              Customize your preferences and generate a day-by-day itinerary.
            </p>
            <GeneratorForm onSubmit={handleGenerate} disabled={isGenerating} />
          </div>
        </aside>

        <main className="min-w-0 md:flex-1 md:min-h-0 md:overflow-y-auto bg-[color:var(--bone)] min-h-[280px] md:min-h-0">
          {error && (
            <div className="mx-5 md:mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm">
              {error}
            </div>
          )}

          {!isGenerating && !result && !error && (
            <div className="min-h-[280px] md:min-h-0 md:h-full flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-[20px] bg-white border hairline mb-6 text-4xl">
                  🗺️
                </div>
                <h3 className="font-display text-2xl mb-2">Ready to explore Maharashtra?</h3>
                <p className="text-[color:var(--ink-soft)] text-sm leading-relaxed">
                  Set your preferences in the panel and click <strong>Generate Itinerary</strong>.
                  Your personalized plan will appear here in about 1–2 minutes.
                </p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="min-h-[280px] md:min-h-0 md:h-full flex items-center justify-center p-8">
              <GenerationProgress progress={progress} />
            </div>
          )}

          {!isGenerating && result && result.parsed.days.length > 0 && (
            <div className="p-6 md:p-10">
              <div className="max-w-3xl mx-auto">
                <CompactItineraryView title={result.title} parsed={result.parsed} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
