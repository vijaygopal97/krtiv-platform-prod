'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { SavedItineraryRecord } from '@/lib/myItinerariesApi';

type Activity = { id: string; label: string; detail: string; icon: ReactNode; time: string };

function buildActivity(items: SavedItineraryRecord[]): Activity[] {
  return items.slice(0, 8).map((item) => ({
    id: item._id,
    label: 'Saved itinerary',
    detail: item.title,
    icon: <Sparkles className="w-3.5 h-3.5" />,
    time: item.updatedAt || item.createdAt ? new Date(item.updatedAt || item.createdAt!).toLocaleDateString() : 'Recently',
  }));
}

type Props = { itineraries: SavedItineraryRecord[] };

export default function RecentActivity({ itineraries }: Props) {
  const acts = buildActivity(itineraries);

  return (
    <section className="travel-dash-card p-5 md:p-6">
      <h2 className="font-display-dash text-lg font-semibold text-[#1F2937] mb-4">Recent Activity</h2>
      {acts.length === 0 ? (
        <p className="text-sm text-[#6B7280] py-4">No activity yet. Generate or save an itinerary to see it here.</p>
      ) : (
        <ul className="space-y-0">
          {acts.map((a, i) => (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="flex gap-3 py-3 border-l-2 border-[#C46B2D]/30 pl-4 ml-2 relative"
            >
              <span className="absolute -left-[5px] top-4 w-2 h-2 rounded-full bg-[#C46B2D]" />
              <span className="w-8 h-8 shrink-0 rounded-lg bg-[#F8F9FB] text-[#C46B2D] grid place-items-center">{a.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1F2937]">{a.label}</p>
                <p className="text-xs text-[#6B7280] truncate">{a.detail}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">{a.time}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
