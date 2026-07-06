'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const EXPERIENCES = [
  { title: 'Food Trails', href: '/category/culinary', color: 'from-amber-500/20 to-orange-600/10' },
  { title: 'Sunrise Trekking', href: '/journeys/kalsubai-sunrise', color: 'from-sky-500/20 to-indigo-600/10' },
  { title: 'Luxury Resorts', href: '/category/urban', color: 'from-violet-500/20 to-purple-600/10' },
  { title: 'Wildlife Safari', href: '/places-to-go/tadoba', color: 'from-emerald-500/20 to-green-700/10' },
  { title: 'Beach Escapes', href: '/journeys/konkan-slow-lunch', color: 'from-cyan-500/20 to-teal-600/10' },
  { title: 'Temple Tours', href: '/category/spiritual', color: 'from-rose-500/20 to-red-600/10' },
  { title: 'Photography Tours', href: '/category/art-culture', color: 'from-fuchsia-500/20 to-pink-600/10' },
  { title: 'Monsoon Drives', href: '/explore', color: 'from-slate-500/20 to-gray-600/10' },
];

export function DashboardExperienceCarousel() {
  return (
    <section className="mt-12 md:mt-16">
      <h2 className="font-display-lux text-2xl md:text-3xl px-4 sm:px-6 lg:px-10 mb-6">Trending experiences</h2>
      <div className="flex gap-4 overflow-x-auto lux-hide-scrollbar px-4 sm:px-6 lg:px-10 pb-2">
        {EXPERIENCES.map((ex, i) => (
          <motion.div key={ex.title} whileHover={{ scale: 1.03 }} transition={{ duration: 0.28 }}>
            <Link
              href={ex.href}
              className={`shrink-0 w-[200px] md:w-[240px] h-[120px] rounded-2xl bg-gradient-to-br ${ex.color} border border-[color:var(--lux-border)] flex items-end p-5 font-display-lux text-lg hover:shadow-lg transition-shadow`}
            >
              {ex.title}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
