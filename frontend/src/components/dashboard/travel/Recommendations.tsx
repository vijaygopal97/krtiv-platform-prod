'use client';

import { motion } from 'framer-motion';

const ITEMS = [
  { emoji: '🌧', title: 'Best weather in Mahabaleshwar', body: 'Cool mist and clear viewpoints this weekend.' },
  { emoji: '🏖', title: 'Weekend trip to Alibaug', body: 'Ferry slots open — pair with a slow coastal lunch.' },
  { emoji: '🐅', title: 'Best safari time in Tadoba', body: 'Early summer drives offer strong wildlife sightings.' },
  { emoji: '🏰', title: 'Explore nearby forts', body: 'Lonavala–Khandala loop with monsoon-ready trails.' },
];

type Props = { onSelect?: (title: string) => void };

export default function Recommendations({ onSelect }: Props) {
  return (
    <section>
      <h2 className="font-display-dash text-base font-semibold text-[#1F2937] mb-3">AI Recommendations</h2>
      <div className="space-y-2">
        {ITEMS.map((item, i) => (
          <motion.button
            key={item.title}
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => onSelect?.(item.title)}
            className="w-full travel-dash-card p-3 text-left hover:border-[#C46B2D]/30 transition-colors duration-250"
          >
            <p className="text-sm font-medium text-[#1F2937]">
              <span className="mr-1.5">{item.emoji}</span>
              {item.title}
            </p>
            <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{item.body}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
