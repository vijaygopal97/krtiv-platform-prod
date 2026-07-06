'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  { text: 'Perfect weather for Mahabaleshwar this week', emoji: '✨' },
  { text: 'Best weekend for Alibaug — calm seas forecast', emoji: '🏖' },
  { text: 'Visit Tadoba this month for tiger sightings', emoji: '🐅' },
  { text: 'Hidden waterfalls near Pune after recent rains', emoji: '🌊' },
];

type Props = {
  onOpenSmartPlanner: () => void;
};

export function DashboardAISuggestions({ onOpenSmartPlanner }: Props) {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-12 md:mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display-lux text-2xl md:text-3xl">Smart AI suggestions</h2>
        <button
          type="button"
          onClick={onOpenSmartPlanner}
          className="text-sm font-semibold text-[color:var(--lux-primary)] inline-flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4" /> Open smart tags
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.text}
            type="button"
            onClick={onOpenSmartPlanner}
            className="lux-suggestion-card rounded-2xl p-5 text-left"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl" aria-hidden>
              {s.emoji}
            </span>
            <p className="mt-3 font-medium text-[color:var(--lux-text)]">{s.text}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
