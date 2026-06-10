'use client';

import type { ParsedItinerary } from '@/lib/parseItinerary';

const SLOT_LABELS: Record<string, string> = {
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
};

interface CompactItineraryViewProps {
  title: string;
  parsed: ParsedItinerary;
}

export default function CompactItineraryView({ title, parsed }: CompactItineraryViewProps) {
  const { theme, region, days } = parsed;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline gap-2 text-sm">
        <span className="font-semibold text-gray-900">{title}</span>
        {region && <span className="text-gray-500">· {region}</span>}
        {theme && theme !== title && <span className="text-gray-400">· {theme}</span>}
      </div>

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
                      <span className="text-xs text-gray-500">{slot.duration}</span>
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
    </div>
  );
}
