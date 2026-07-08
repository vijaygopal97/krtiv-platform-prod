'use client';

import type { ParsedItinerary } from '@/lib/parseItinerary';
import AiItineraryDisclaimer from '@/components/itinerary/AiItineraryDisclaimer';

const SLOT_LABELS: Record<string, string> = {
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
};

interface CompactItineraryViewProps {
  title: string;
  parsed: ParsedItinerary;
  /** Show mandatory AI transparency notice (AI Trip Planner output only). */
  showAiDisclaimer?: boolean;
}

export default function CompactItineraryView({ title, parsed, showAiDisclaimer = false }: CompactItineraryViewProps) {
  const { theme, region, routing, days } = parsed;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline gap-2 text-sm">
        <span className="font-semibold text-gray-900">{title}</span>
        {region && <span className="text-gray-500">· {region}</span>}
        {theme && theme !== title && <span className="text-gray-400">· {theme}</span>}
      </div>

      {routing && (routing.outboundFrom || routing.outboundTo) && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 rounded-xl p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#C46B2D] mb-2">
            Getting to Maharashtra
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {routing.outboundFrom || 'Your city'} → {routing.outboundTo || 'Maharashtra'}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
            {routing.outboundMode && <span>Mode: {routing.outboundMode}</span>}
            {routing.outboundDuration && <span>Duration: {routing.outboundDuration}</span>}
          </div>
          {routing.outboundNotes && (
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{routing.outboundNotes}</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {days.map((day) => (
          <div
            key={day.dayNum}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          >
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-gray-900">Day {day.dayNum}</span>
              {day.baseCity && (
                <span className="text-sm text-gray-600">{day.baseCity}</span>
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {(day.slots || []).map((slot, idx) => (
                <div key={idx} className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#FF9933] bg-orange-50 px-2 py-0.5 rounded">
                      {SLOT_LABELS[slot.time] || slot.time}
                    </span>
                    {slot.location && (
                      <span className="font-semibold text-gray-900">{slot.location}</span>
                    )}
                    {slot.duration && (
                      <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {slot.duration}
                      </span>
                    )}
                    {slot.travelTime && (
                      <span className="text-xs font-medium text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                        {slot.travelTime}
                      </span>
                    )}
                  </div>
                  {slot.activities && (
                    <p className="text-sm text-gray-700 mt-0.5">{slot.activities}</p>
                  )}
                  {slot.why && (
                    <p className="text-xs text-gray-500 mt-1 italic">{slot.why}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAiDisclaimer && <AiItineraryDisclaimer className="pt-1" />}
    </div>
  );
}
