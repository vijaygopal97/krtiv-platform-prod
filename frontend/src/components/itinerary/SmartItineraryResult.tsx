'use client';

import { useMemo, useState } from 'react';
import CompactItineraryView from '@/components/dashboard/CompactItineraryView';
import { MaharashtraMapVisual } from '@/components/krtiv/MaharashtraMapVisual';
import {
  getItineraryGeoPoints,
  parsedItineraryToMapShape,
} from '@/components/krtiv/maharashtraMapUtils';
import type { ParsedItinerary } from '@/lib/parseItinerary';
import type { ItineraryExtras } from '@/lib/itineraryExtras';
import { authService } from '@/services/authService';
import { saveItinerary } from '@/lib/myItinerariesApi';
import { downloadItineraryPdf } from '@/lib/itineraryPdf';
import { AI_ITINERARY_DISCLAIMER_SHORT } from '@/lib/aiItineraryDisclaimer';

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
  const [activeMapDay, setActiveMapDay] = useState(0);

  const mapItinerary = useMemo(() => parsedItineraryToMapShape(parsed), [parsed]);
  const mapPoints = useMemo(() => getItineraryGeoPoints(mapItinerary), [mapItinerary]);

  const handleSave = async (favorite: boolean) => {
    if (!authService.isAuthenticated()) {
      setSaveMsg('Sign in to save itineraries to your account.');
      return;
    }
    setSaving(true);
    setSaveMsg('');
    const { item, error: saveErr } = await saveItinerary({
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
    setSaveMsg(item ? (favorite ? 'Added to favorites.' : 'Itinerary saved.') : saveErr || 'Could not save. Try again.');
  };

  const handleShare = async () => {
    const text = `${title}\n\n${rawText.slice(0, 2000)}${rawText.length > 2000 ? '…' : ''}\n\n---\n${AI_ITINERARY_DISCLAIMER_SHORT}`;
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
      aiGenerated: true,
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

      {mapPoints.length > 0 && (
        <div className="rounded-[20px] border hairline bg-[color:var(--bone)] p-4 md:p-6">
          <p className="eyebrow text-[color:var(--saffron)]">On the map</p>
          <h3 className="font-display text-2xl mt-2 text-[color:var(--ink)]">Your route across Maharashtra</h3>
          <p className="text-sm text-[color:var(--ink-soft)] mt-2 mb-5">
            Tap a numbered stop to highlight that day on the map.
          </p>
          <MaharashtraMapVisual
            itinerary={mapItinerary}
            activeDay={activeMapDay}
            onActiveDayChange={setActiveMapDay}
            aspectClassName="aspect-[4/3] min-h-[300px]"
          />
        </div>
      )}

      <CompactItineraryView title={title} parsed={parsed} showAiDisclaimer />

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
