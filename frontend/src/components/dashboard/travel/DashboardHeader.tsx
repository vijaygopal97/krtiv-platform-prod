'use client';

import { motion } from 'framer-motion';
import { Calendar, Plus, Search } from 'lucide-react';
import { formatDashDate, timeGreeting } from './dashboardUtils';

type Props = {
  userName: string;
  onCreateTrip: () => void;
  onSearch?: (q: string) => void;
};

export default function DashboardHeader({ userName, onCreateTrip, onSearch }: Props) {
  const firstName = userName.split(' ')[0] || userName;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="travel-dash-card p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1 className="font-display-dash text-2xl md:text-[1.65rem] font-semibold text-[#1F2937]">
          {timeGreeting()}, {firstName} 👋
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">Welcome back. Continue planning your Maharashtra journey.</p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-[#6B7280] px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
          <Calendar className="w-4 h-4 shrink-0 text-[#C46B2D]" />
          <span className="whitespace-nowrap">{formatDashDate()}</span>
        </div>
        <div className="flex items-center gap-2 travel-dash-card px-3 h-11 flex-1 sm:w-48">
          <Search className="w-4 h-4 text-[#9CA3AF]" />
          <input
            type="search"
            placeholder="Quick search"
            className="w-full text-sm bg-transparent outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const q = (e.target as HTMLInputElement).value.trim();
                if (q && onSearch) onSearch(q);
              }
            }}
          />
        </div>
        <button
          type="button"
          onClick={onCreateTrip}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#C46B2D] text-white text-sm font-semibold shadow-md hover:brightness-105 active:scale-[0.98] transition-all duration-250"
        >
          <Plus className="w-4 h-4" />
          Create Trip
        </button>
      </div>
    </motion.section>
  );
}
