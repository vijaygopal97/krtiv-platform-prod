'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Bot, MapPin, Route, Sparkles } from 'lucide-react';

type Stat = { label: string; value: number; icon: ReactNode };

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 600;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setDisplay(Math.round(start + (value - start) * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>{display}</span>;
}

type Props = {
  tripsPlanned: number;
  placesSaved: number;
  citiesExplored: number;
  aiSuggestionsUsed: number;
};

export default function StatisticsCards({ tripsPlanned, placesSaved, citiesExplored, aiSuggestionsUsed }: Props) {
  const stats: Stat[] = [
    { label: 'Trips Planned', value: tripsPlanned, icon: <Route className="w-4 h-4" /> },
    { label: 'Places Saved', value: placesSaved, icon: <MapPin className="w-4 h-4" /> },
    { label: 'Cities Explored', value: citiesExplored, icon: <Sparkles className="w-4 h-4" /> },
    { label: 'AI Suggestions Used', value: aiSuggestionsUsed, icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
          className="travel-dash-card p-4"
        >
          <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-[#F8F9FB] text-[#C46B2D] mb-2">{s.icon}</span>
          <p className="text-2xl font-semibold text-[#1F2937]">
            <AnimatedNumber value={s.value} />
          </p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
