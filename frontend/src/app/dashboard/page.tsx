'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService, type User } from '@/services/authService';
import { startItineraryJob, pollJob, type ItineraryJobRequest } from '@/lib/signpostApi';
import { parseItineraryText } from '@/lib/parseItinerary';
import BuilderPlannerForm from '@/components/dashboard/travel/BuilderPlannerForm';
import GenerationProgress from '@/components/dashboard/GenerationProgress';
import CompactItineraryView from '@/components/dashboard/CompactItineraryView';
import SavedItinerariesPanel from '@/components/dashboard/SavedItinerariesPanel';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import { saveItinerary, fetchMyItineraries, type SavedItineraryRecord } from '@/lib/myItinerariesApi';
import { extractItineraryExtras } from '@/lib/itineraryExtras';
import { downloadItineraryPdf } from '@/lib/itineraryPdf';
import DashboardAdminStatsTab from '@/components/dashboard/DashboardAdminStatsTab';
import DashboardNav, { type DashTab } from '@/components/dashboard/travel/DashboardNav';
import DashboardHome from '@/components/dashboard/travel/DashboardHome';
import SavedPlaces from '@/components/dashboard/travel/SavedPlaces';

const POLL_INTERVAL_MS = 2500;

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as DashTab | null;

  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<DashTab>(tabParam || 'home');
  const [savedItems, setSavedItems] = useState<SavedItineraryRecord[]>([]);
  const [favorites, setFavorites] = useState<SavedItineraryRecord[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

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

  const loadLibrary = useCallback(async () => {
    setLoadingSaved(true);
    const [all, fav] = await Promise.all([fetchMyItineraries(false), fetchMyItineraries(true)]);
    setSavedItems(all);
    setFavorites(fav);
    setLoadingSaved(false);
  }, []);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login?next=/dashboard&from=protected');
      return;
    }
    setUser(currentUser);
    if (tabParam === 'stats' && currentUser.role !== 'admin') {
      setTab('home');
    } else if (tabParam) {
      setTab(tabParam);
    }
    void loadLibrary();
  }, [router, tabParam, loadLibrary]);

  const setTabAndUrl = (next: DashTab) => {
    setTab(next);
    const qs = next === 'home' ? '' : `?tab=${next}`;
    router.replace(`/dashboard${qs}`, { scroll: false });
  };

  const handleGenerate = async (payload: ItineraryJobRequest) => {
    setError(null);
    setResult(null);
    setIsGenerating(true);
    setProgress(10);
    setTabAndUrl('builder');

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
          } else {
            setError('Itinerary returned no days. Please try again.');
          }
        } catch {
          setError('Could not parse itinerary. Please try again.');
        }
        setIsGenerating(false);
        void loadLibrary();
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
    const { item, error: saveErr } = await saveItinerary({
      title: result.title,
      itineraryText: result.raw,
      parsedSummary: {
        theme: result.parsed.theme,
        region: result.parsed.region,
        dayCount: result.parsed.days?.length,
      },
      source: 'dashboard',
    });
    setSaveNote(item ? 'Saved to your library.' : saveErr || 'Save failed.');
    if (item) void loadLibrary();
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
      aiGenerated: true,
    });
    if (!res.ok) setPdfNote(res.message);
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#F8F9FB]">
        <p className="text-[#6B7280] animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
      <DashboardNav user={user} activeTab={tab} onTabChange={setTabAndUrl} onLogout={handleLogout} />

      {tab === 'home' && (
        <DashboardHome
          user={user}
          savedItems={savedItems}
          favorites={favorites}
          loadingSaved={loadingSaved}
          onTabChange={setTabAndUrl}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      )}

      {tab === 'smart' && (
        <div className="flex-1 overflow-y-auto max-w-[1440px] mx-auto w-full px-4 md:px-8 py-8">
          <div className="travel-dash-card p-6 md:p-8">
            <SmartKeywordItinerary context="home" dashboardMode />
          </div>
        </div>
      )}

      {tab === 'builder' && (
        <div className="flex flex-col lg:flex-row flex-1 lg:min-h-0">
          <aside className="w-full lg:w-[22rem] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-[#E5E7EB] bg-white lg:overflow-y-auto">
            <div className="p-6">
              <h2 className="font-display-dash text-lg font-semibold text-[#1F2937]">Full planner</h2>
              <p className="text-sm text-[#6B7280] mt-1 mb-5">Detailed preferences for day-by-day itineraries.</p>
              <BuilderPlannerForm onSubmit={handleGenerate} disabled={isGenerating} />
            </div>
          </aside>
          <main className="min-w-0 lg:flex-1 lg:min-h-0 lg:overflow-y-auto bg-[#F8F9FB] min-h-[280px]">
            {error && (
              <div className="mx-5 md:mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm">{error}</div>
            )}
            {!isGenerating && !result && !error && (
              <div className="min-h-[280px] lg:h-full flex items-center justify-center p-8 text-center text-sm text-[#6B7280]">
                Generate from the form or use the home dashboard AI widget.
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
                  <button
                    type="button"
                    onClick={() => void handleSaveResult()}
                    className="h-10 px-4 rounded-xl bg-[#C46B2D] text-white text-sm font-semibold"
                  >
                    Save to library
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm bg-white hover:bg-[#F8F9FB]"
                  >
                    Download PDF
                  </button>
                </div>
                {saveNote && <p className="text-sm mb-4 text-[#6B7280]">{saveNote}</p>}
                {pdfNote && <p className="text-sm mb-4 text-red-700">{pdfNote}</p>}
                <CompactItineraryView title={result.title} parsed={result.parsed} showAiDisclaimer />
              </div>
            )}
          </main>
        </div>
      )}

      {tab === 'saved' && (
        <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 py-8">
          <h1 className="font-display-dash text-xl font-semibold mb-4">My Trips</h1>
          <div className="travel-dash-card overflow-hidden">
            <SavedItinerariesPanel />
          </div>
        </div>
      )}

      {tab === 'saved-places' && (
        <div className="flex-1 overflow-y-auto max-w-5xl mx-auto w-full px-4 py-8">
          <h1 className="font-display-dash text-xl font-semibold mb-2">Saved Places</h1>
          <p className="text-sm text-[#6B7280] mb-6">
            Destinations you saved across the site — plan a route-optimized AI itinerary from your starting city.
          </p>
          <SavedPlaces
            fullPage
            showRoutePlanner
            isGenerating={isGenerating}
            onGenerateRoute={handleGenerate}
            onPlanWithAI={(req) => {
              sessionStorage.setItem('dash-prefill-destination', req.destination);
              setTabAndUrl('builder');
            }}
            onAddToTrip={(dest) => {
              sessionStorage.setItem('dash-prefill-destination', dest);
              setTabAndUrl('builder');
            }}
            onAddToItinerary={(dest) => {
              sessionStorage.setItem('dash-prefill-destination', dest);
              setTabAndUrl('builder');
            }}
          />
        </div>
      )}

      {tab === 'favorites' && (
        <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 py-8">
          <h1 className="font-display-dash text-xl font-semibold mb-4">Saved</h1>
          <div className="travel-dash-card overflow-hidden">
            <SavedItinerariesPanel favoritesOnly />
          </div>
        </div>
      )}

      {tab === 'profile' && (
        <div className="flex-1 p-8 max-w-lg mx-auto w-full">
          <div className="travel-dash-card p-6 space-y-4">
            {user.profilePicture && (
              <img src={user.profilePicture} alt="" width={64} height={64} className="rounded-2xl" />
            )}
            <div>
              <p className="text-xs text-[#6B7280]">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Email</p>
              <p className="font-medium">{user.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Sign-in method</p>
              <p className="font-medium capitalize">{user.authProvider || 'local'}</p>
            </div>
            {user.lastLoginAt && (
              <div>
                <p className="text-xs text-[#6B7280]">Last login</p>
                <p className="font-medium">{new Date(user.lastLoginAt).toLocaleString()}</p>
              </div>
            )}
            {user.role === 'admin' && (
              <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap gap-2">
                <Link
                  href="/dashboard?tab=stats"
                  className="text-sm px-4 h-9 inline-flex items-center rounded-xl bg-[#C46B2D] text-white font-semibold"
                >
                  Platform stats
                </Link>
                <Link href="/admin/analytics" className="text-sm px-4 h-9 inline-flex items-center rounded-xl border border-[#E5E7EB]">
                  Full analytics
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'stats' && user.role === 'admin' && (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <DashboardAdminStatsTab />
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-[#F8F9FB]">Loading…</div>}>
      <DashboardInner />
    </Suspense>
  );
}
