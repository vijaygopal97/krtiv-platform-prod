'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { assetPath } from '@/lib/basePath';

const HERO_IMAGE = assetPath('/krtiv/hero-image.jpeg');

const QUICK_FILTERS = [
  'Beaches',
  'Forts',
  'Heritage',
  'Wildlife',
  'Waterfalls',
  'Hill Stations',
  'Road Trips',
  'Food',
  'Adventure',
  'Hidden Gems',
];

type Props = {
  userName: string;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  activeFilter: string | null;
  onFilterClick: (filter: string) => void;
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardHero({
  userName,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterClick,
}: Props) {
  const firstName = userName.split(' ')[0] || 'Traveler';

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] mx-4 sm:mx-6 lg:mx-10 mt-6 min-h-[320px] md:min-h-[380px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 lux-hero-overlay" />
      <motion.div
        className="relative z-10 px-6 md:px-12 py-10 md:py-14 max-w-3xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-white/80 text-sm tracking-wide">
          {greeting()}, {firstName} 👋
        </p>
        <h1 className="font-display-lux text-3xl md:text-5xl text-white mt-3 leading-tight text-balance">
          Discover the beauty of Maharashtra with your personal AI travel planner.
        </h1>

        <div className="mt-8 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--lux-muted)]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search destinations, experiences, temples, beaches..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/95 text-[color:var(--lux-text)] shadow-lg border-0 outline-none focus:ring-2 focus:ring-[color:var(--lux-primary-light)]"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onFilterClick(f)}
              className={`lux-chip text-white/95 ${
                activeFilter === f
                  ? 'lux-chip--active !bg-white/20 !border-white/40 !text-white'
                  : '!bg-white/10 !border-white/25 text-white/90 hover:!bg-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export { QUICK_FILTERS };
