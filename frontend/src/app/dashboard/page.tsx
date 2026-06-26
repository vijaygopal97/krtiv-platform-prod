'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { authService, type User } from '@/services/authService';
import { startItineraryJob, pollJob, type ItineraryJobRequest } from '@/lib/signpostApi';
import { parseItineraryText } from '@/lib/parseItinerary';
import GeneratorForm from '@/components/dashboard/GeneratorForm';
import GenerationProgress from '@/components/dashboard/GenerationProgress';
import CompactItineraryView from '@/components/dashboard/CompactItineraryView';
import SavedItinerariesPanel from '@/components/dashboard/SavedItinerariesPanel';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import { saveItinerary } from '@/lib/myItinerariesApi';
import { extractItineraryExtras } from '@/lib/itineraryExtras';
import { downloadItineraryPdf } from '@/lib/itineraryPdf';
import DashboardAdminStatsTab from '@/components/dashboard/DashboardAdminStatsTab';
import { krtivLogo } from '@/lib/krtivPaths';

const POLL_INTERVAL_MS = 2500;

type Tab = 'smart' | 'builder' | 'saved' | 'favorites' | 'profile' | 'stats';

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'smart';
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    title: string;
    parsed: ReturnType<typeof parseItineraryText>;
    raw: string;
  } | null>(null);
  const [saveNote, setSaveNote] = useState('');
  const [pdfNote, setPdfNote] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login?next=/dashboard');
      return;
    }
    setUser(currentUser);
    if (initialTab === 'stats' && currentUser.role !== 'admin') {
      setTab('smart');
    }
  }, [router, initialTab]);

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
              raw: pollRes.result.itinerary,
            });
            setTab('builder');
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

  const handleSaveResult = async () => {
    if (!result || !user) return;
    setSaveNote('');
    const item = await saveItinerary({
      title: result.title,
      itineraryText: result.raw,
      parsedSummary: {
        theme: result.parsed.theme,
        region: result.parsed.region,
        dayCount: result.parsed.days?.length,
      },
      source: 'dashboard',
    });
    setSaveNote(item ? 'Saved to your library.' : 'Save failed.');
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    setPdfNote('');
    const extras = extractItineraryExtras(result.raw);
    const res = downloadItineraryPdf({
      title: result.title,
      parsed: result.parsed,
      rawText: result.raw,
      extras,
      keywords: [],
      categoryFocus: 'Maharashtra Tourism',
      userName: user?.name,
    });
    if (!res.ok) setPdfNote(res.message);
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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'smart', label: 'Smart tags' },
    { id: 'builder', label: 'Full builder' },
    { id: 'saved', label: 'Saved' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'profile', label: 'Profile' },
    ...(user.role === 'admin' ? [{ id: 'stats' as const, label: 'Stats' }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <header className="flex-shrink-0 frosted border-b hairline px-5 md:px-10 h-16 md:h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          <img src={krtivLogo()} alt="" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
          <span className="hidden sm:inline text-[color:var(--ink-soft)] text-sm">Dashboard</span>
        </Link>
        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <Link
              href="/admin/hero"
              className="text-sm px-3 h-9 hidden sm:inline-flex items-center rounded-full border hairline hover:bg-[color:var(--bone)]"
            >
              Hero CMS
            </Link>
          )}
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="" width={36} height={36} className="rounded-full" />
          ) : null}
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

      <nav className="flex gap-1 overflow-x-auto px-4 py-3 border-b hairline bg-white/80 no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-4 h-9 rounded-full text-sm transition ${
              tab === t.id ? 'bg-[color:var(--ink)] text-white' : 'text-[color:var(--ink-soft)] hover:bg-[color:var(--bone)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'smart' && (
        <div className="flex-1 overflow-y-auto">
          <SmartKeywordItinerary context="home" compact />
        </div>
      )}

      {tab === 'builder' && (
        <div className="flex flex-col md:flex-row md:flex-1 md:min-h-0">
          <aside className="w-full md:w-[24rem] flex-shrink-0 border-b md:border-b-0 md:border-r hairline bg-white md:overflow-y-auto">
            <div className="p-6 md:p-8">
              <p className="eyebrow">AI planner</p>
              <h2 className="font-display text-2xl mt-2">Plan your journey</h2>
              <p className="text-sm text-[color:var(--ink-soft)] mt-2 mb-6">
                Customize preferences for a detailed day-by-day itinerary.
              </p>
              <GeneratorForm onSubmit={handleGenerate} disabled={isGenerating} />
            </div>
          </aside>
          <main className="min-w-0 md:flex-1 md:min-h-0 md:overflow-y-auto bg-[color:var(--bone)] min-h-[280px]">
            {error && (
              <div className="mx-5 md:mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm">{error}</div>
            )}
            {!isGenerating && !result && !error && (
              <div className="min-h-[280px] md:h-full flex items-center justify-center p-8 text-center text-sm text-[color:var(--ink-soft)]">
                Generate from the form or use Smart tags.
              </div>
            )}
            {isGenerating && (
              <div className="min-h-[280px] flex items-center justify-center p-8">
                <GenerationProgress progress={progress} />
              </div>
            )}
            {!isGenerating && result && result.parsed.days.length > 0 && (
              <div className="p-6 md:p-10 max-w-3xl mx-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  <button type="button" onClick={() => void handleSaveResult()} className="h-10 px-4 rounded-full bg-[color:var(--ink)] text-white text-sm">
                    Save to library
                  </button>
                  <button type="button" onClick={handleDownloadPdf} className="h-10 px-4 rounded-full border hairline text-sm bg-white hover:bg-[color:var(--bone)]">
                    Download PDF
                  </button>
                </div>
                {saveNote && <p className="text-sm mb-4 text-[color:var(--ink-soft)]">{saveNote}</p>}
                {pdfNote && <p className="text-sm mb-4 text-red-700">{pdfNote}</p>}
                <CompactItineraryView title={result.title} parsed={result.parsed} />
              </div>
            )}
          </main>
        </div>
      )}

      {tab === 'saved' && (
        <div className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full">
          <SavedItinerariesPanel />
        </div>
      )}

      {tab === 'favorites' && (
        <div className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full">
          <SavedItinerariesPanel favoritesOnly />
        </div>
      )}

      {tab === 'profile' && (
        <div className="flex-1 p-8 max-w-lg mx-auto w-full">
          <div className="rounded-2xl bg-white border hairline p-6 space-y-4">
            {user.profilePicture && (
              <img src={user.profilePicture} alt="" width={64} height={64} className="rounded-full" />
            )}
            <div>
              <p className="text-xs text-[color:var(--ink-soft)]">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-xs text-[color:var(--ink-soft)]">Email</p>
              <p className="font-medium">{user.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[color:var(--ink-soft)]">Sign-in method</p>
              <p className="font-medium capitalize">{user.authProvider || 'local'}</p>
            </div>
            {user.lastLoginAt && (
              <div>
                <p className="text-xs text-[color:var(--ink-soft)]">Last login</p>
                <p className="font-medium">{new Date(user.lastLoginAt).toLocaleString()}</p>
              </div>
            )}
            {user.role === 'admin' && (
              <div className="pt-4 border-t hairline flex flex-wrap gap-2">
                <Link
                  href="/dashboard?tab=stats"
                  className="text-sm px-4 h-9 inline-flex items-center rounded-full bg-[color:var(--ink)] text-white"
                >
                  Platform stats
                </Link>
                <Link
                  href="/admin/analytics"
                  className="text-sm px-4 h-9 inline-flex items-center rounded-full border hairline"
                >
                  Full analytics
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'stats' && user.role === 'admin' && <DashboardAdminStatsTab />}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-[color:var(--ivory)]">Loading…</div>}>
      <DashboardInner />
    </Suspense>
  );
}
