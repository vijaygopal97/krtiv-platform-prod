'use client';

import { useState } from 'react';
import CompactItineraryView from '@/components/dashboard/CompactItineraryView';
import type { ParsedItinerary } from '@/lib/parseItinerary';
import type { ItineraryExtras } from '@/lib/itineraryExtras';
import { authService } from '@/services/authService';
import { saveItinerary } from '@/lib/myItinerariesApi';
import { downloadItineraryPdf } from '@/lib/itineraryPdf';

type Props = {
  title: string;
  parsed: ParsedItinerary;
  rawText: string;
  extras: ItineraryExtras;
  keywords: string[];
  categorySlug: string;
  categoryFocus: string;
  jobId?: string;
};

function ExtraBlock({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="rounded-2xl border hairline bg-white p-5">
      <h4 className="text-sm font-semibold text-[color:var(--ink)] mb-2">{label}</h4>
      <p className="text-sm text-[color:var(--ink-soft)] whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  );
}

export default function SmartItineraryResult({
  title,
  parsed,
  rawText,
  extras,
  keywords,
  categorySlug,
  categoryFocus,
  jobId,
}: Props) {
  const [saveMsg, setSaveMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [pdfMsg, setPdfMsg] = useState('');

  const handleSave = async (favorite: boolean) => {
    if (!authService.isAuthenticated()) {
      setSaveMsg('Sign in to save itineraries to your account.');
      return;
    }
    setSaving(true);
    setSaveMsg('');
    const item = await saveItinerary({
      title,
      itineraryText: rawText,
      keywords,
      categorySlug,
      categoryFocus,
      parsedSummary: { theme: parsed.theme, region: parsed.region, dayCount: parsed.days?.length },
      isFavorite: favorite,
      jobId,
      source: 'smart-keywords',
    });
    setSaving(false);
    setSaveMsg(item ? (favorite ? 'Added to favorites.' : 'Itinerary saved.') : 'Could not save. Try again.');
  };

  const handleShare = async () => {
    const text = `${title}\n\n${rawText.slice(0, 2000)}${rawText.length > 2000 ? '…' : ''}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setSaveMsg('Itinerary copied to clipboard.');
    } catch {
      setSaveMsg('Could not share automatically.');
    }
  };

  const handlePrintPdf = () => {
    setPdfMsg('');
    const user = authService.getCurrentUser();
    const res = downloadItineraryPdf({
      title,
      parsed,
      rawText,
      extras,
      keywords,
      categoryFocus,
      userName: user?.name,
    });
    if (!res.ok) {
      setPdfMsg(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {keywords.map((k) => (
          <span key={k} className="text-xs px-3 py-1 rounded-full bg-[color:var(--saffron)]/15 text-[color:var(--ink)] border border-[color:var(--saffron)]/25">
            {k}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={saving} onClick={() => handleSave(false)} className="h-10 px-4 rounded-full bg-[color:var(--ink)] text-white text-sm hover:opacity-90 disabled:opacity-50">
          Save itinerary
        </button>
        <button type="button" disabled={saving} onClick={() => handleSave(true)} className="h-10 px-4 rounded-full border hairline text-sm hover:bg-white">
          Add to favorites
        </button>
        <button type="button" onClick={handleShare} className="h-10 px-4 rounded-full border hairline text-sm hover:bg-white">
          Share
        </button>
        <button type="button" onClick={handlePrintPdf} className="h-10 px-4 rounded-full border hairline text-sm hover:bg-white">
          Download PDF
        </button>
      </div>
      {saveMsg && <p className="text-sm text-[color:var(--ink-soft)]">{saveMsg}</p>}
      {pdfMsg && <p className="text-sm text-red-700">{pdfMsg}</p>}

      <CompactItineraryView title={title} parsed={parsed} />

      <div className="grid md:grid-cols-2 gap-4">
        <ExtraBlock label="Food recommendations" value={extras.foodRecommendations} />
        <ExtraBlock label="Travel tips" value={extras.travelTips} />
        <ExtraBlock label="Best time to visit" value={extras.bestTimeToVisit} />
        <ExtraBlock label="Estimated budget" value={extras.estimatedBudget} />
        <ExtraBlock label="Nearby places" value={extras.nearbyPlaces} />
        <ExtraBlock label="Related destinations" value={extras.relatedDestinations} />
        <ExtraBlock label="Similar experiences" value={extras.similarExperiences} />
        <ExtraBlock label="Hidden gems" value={extras.hiddenGems} />
      </div>
    </div>
  );
}
