'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Bot, FileText, MapPin, Plus } from 'lucide-react';
import type { DashTab } from './DashboardNav';

type Action = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  tab: DashTab;
};

const ACTIONS: Action[] = [
  { id: 'new', title: 'Create New Trip', description: 'Start a fresh AI itinerary', icon: <Plus className="w-5 h-5" />, tab: 'builder' },
  { id: 'places', title: 'Saved Places', description: 'Browse your wishlist', icon: <MapPin className="w-5 h-5" />, tab: 'saved-places' },
  { id: 'itineraries', title: 'My Itineraries', description: 'Open saved plans', icon: <FileText className="w-5 h-5" />, tab: 'saved' },
  { id: 'ai', title: 'AI Planner', description: 'Smart tag generator', icon: <Bot className="w-5 h-5" />, tab: 'smart' },
];

type Props = { onNavigate: (tab: DashTab) => void };

export default function QuickActions({ onNavigate }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {ACTIONS.map((action, i) => (
        <motion.button
          key={action.id}
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
          whileHover={{ y: -4, scale: 1.01 }}
          onClick={() => onNavigate(action.tab)}
          className="travel-dash-card p-5 text-left group hover:border-[#C46B2D]/40 hover:shadow-[var(--dash-shadow-hover)] transition-all duration-250"
        >
          <span className="inline-flex w-11 h-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C46B2D]/15 to-[#F4A261]/20 text-[#C46B2D] mb-3 group-hover:scale-105 transition-transform duration-250">
            {action.icon}
          </span>
          <h3 className="font-semibold text-[#1F2937] text-sm">{action.title}</h3>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{action.description}</p>
        </motion.button>
      ))}
    </div>
  );
}
