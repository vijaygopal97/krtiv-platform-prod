'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { Brain, Compass, Heart, MapPinned } from 'lucide-react';

type Stat = { label: string; value: number; icon: React.ReactNode };

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

type Props = {
  tripsPlanned: number;
  placesSaved: number;
  destinationsExplored: number;
  aiRecommendations: number;
};

export function DashboardStatsCards({
  tripsPlanned,
  placesSaved,
  destinationsExplored,
  aiRecommendations,
}: Props) {
  const stats: Stat[] = [
    { label: 'Trips planned', value: tripsPlanned, icon: <Compass className="w-6 h-6 text-[color:var(--lux-primary)]" /> },
    { label: 'Places saved', value: placesSaved, icon: <Heart className="w-6 h-6 text-[color:var(--lux-primary)]" /> },
    { label: 'Destinations explored', value: destinationsExplored, icon: <MapPinned className="w-6 h-6 text-[color:var(--lux-primary)]" /> },
    { label: 'AI recommendations', value: aiRecommendations, icon: <Brain className="w-6 h-6 text-[color:var(--lux-primary)]" /> },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="lux-card lux-gradient-border-top p-5 md:p-6"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.32 }}
            whileHover={{ y: -4 }}
          >
            <div className="mb-3">{s.icon}</div>
            <p className="font-display-lux text-3xl md:text-4xl text-[color:var(--lux-text)]">
              <AnimatedNumber value={s.value} />
            </p>
            <p className="text-xs md:text-sm text-[color:var(--lux-muted)] mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
