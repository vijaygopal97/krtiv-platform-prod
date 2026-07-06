'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MoreHorizontal } from 'lucide-react';
import { assetPath } from '@/lib/basePath';
import type { SavedItineraryRecord } from '@/lib/myItinerariesApi';
import { tripDateRange, tripProgress, tripStatus } from './dashboardUtils';

const FALLBACK_IMG = assetPath('/places/heroes/mumbai.jpg');

type Props = {
  item: SavedItineraryRecord;
  index?: number;
  onContinue: (id: string) => void;
  onMenu?: (id: string) => void;
};

export default function TripCard({ item, index = 0, onContinue, onMenu }: Props) {
  const progress = tripProgress(item);
  const status = tripStatus(progress);
  const region = item.parsedSummary?.region || item.categoryFocus || 'Maharashtra';
  const statusClass =
    status.tone === 'green'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status.tone === 'amber'
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      className="travel-dash-card overflow-hidden flex flex-col"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={FALLBACK_IMG}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className={`absolute top-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusClass}`}>
          {status.label}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-[#1F2937] line-clamp-1">{item.title}</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">{tripDateRange(item)} · {region}</p>
          </div>
          <button
            type="button"
            aria-label="Actions"
            onClick={() => onMenu?.(item._id)}
            className="p-1.5 rounded-lg hover:bg-[#F8F9FB] text-[#6B7280]"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-[#6B7280] mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-[#C46B2D] to-[#F4A261]"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => onContinue(item._id)}
          className="mt-auto inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-[#1F2937] text-white text-sm font-semibold hover:bg-[#374151] transition-colors duration-250"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  );
}
