'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { SavedItineraryRecord } from '@/lib/myItinerariesApi';
import { assetPath } from '@/lib/basePath';

const FALLBACK_IMG = assetPath('/krtiv/hero-image.jpeg');

type Props = {
  items: SavedItineraryRecord[];
  onContinue: () => void;
};

export function DashboardContinuePlanning({ items, onContinue }: Props) {
  if (!items.length) return null;

  return (
    <section className="mt-12 md:mt-16">
      <div className="px-4 sm:px-6 lg:px-10 flex items-end justify-between mb-6">
        <h2 className="font-display-lux text-2xl md:text-3xl">Continue planning</h2>
        <button type="button" onClick={onContinue} className="text-sm text-[color:var(--lux-primary)] font-medium">
          View all →
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto lux-hide-scrollbar px-4 sm:px-6 lg:px-10 pb-2">
        {items.slice(0, 6).map((item, i) => {
          const days = item.parsedSummary?.dayCount ?? 5;
          const progress = Math.min(100, Math.max(12, ((i % 3) + 1) * (100 / days)));
          const dayDone = Math.max(1, Math.round((progress / 100) * days));
          return (
            <motion.article
              key={item._id}
              className="lux-card shrink-0 w-[min(85vw,320px)] overflow-hidden"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.28 }}
            >
              <div className="aspect-[16/10] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={FALLBACK_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-display-lux text-lg">{item.title}</h3>
                <p className="text-xs text-[color:var(--lux-muted)] mt-1">
                  Day {dayDone} of {days}
                </p>
                <div className="mt-3 h-1.5 rounded-full bg-[color:var(--lux-border)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[color:var(--lux-primary-light)] to-[color:var(--lux-primary)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <Link
                  href="/dashboard?tab=saved"
                  className="mt-4 inline-flex text-sm font-semibold text-[color:var(--lux-primary)]"
                >
                  Continue →
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
