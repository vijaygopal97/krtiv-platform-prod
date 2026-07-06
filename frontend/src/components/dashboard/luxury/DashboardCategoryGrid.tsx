'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { assetPath } from '@/lib/basePath';

export type CategoryItem = {
  id: string;
  name: string;
  emoji: string;
  href: string;
  image: string;
};

export const DASHBOARD_CATEGORIES: CategoryItem[] = [
  { id: 'beaches', name: 'Beaches', emoji: '🏖', href: '/category/adventure', image: assetPath('/categories/adventure-ecotourism.jpg') },
  { id: 'forts', name: 'Forts', emoji: '🏰', href: '/category/historical', image: assetPath('/categories/historical-heritage.jpg') },
  { id: 'wildlife', name: 'Wildlife', emoji: '🐅', href: '/category/adventure', image: assetPath('/categories/adventure-ecotourism.jpg') },
  { id: 'waterfalls', name: 'Waterfalls', emoji: '🏞', href: '/category/adventure', image: assetPath('/categories/adventure-ecotourism.jpg') },
  { id: 'temples', name: 'Temples', emoji: '⛩', href: '/category/spiritual', image: assetPath('/categories/spiritual-pilgrimage.jpg') },
  { id: 'road', name: 'Road Trips', emoji: '🚗', href: '/explore', image: assetPath('/categories/urban-contemporary.jpg') },
  { id: 'hills', name: 'Hill Stations', emoji: '🌄', href: '/places-to-go/lonavala', image: assetPath('/categories/adventure-ecotourism.jpg') },
  { id: 'food', name: 'Food', emoji: '🍲', href: '/category/culinary', image: assetPath('/categories/culinary-rural.jpg') },
  { id: 'photo', name: 'Photography', emoji: '📷', href: '/category/art-culture', image: assetPath('/categories/art-craft-culture.jpg') },
  { id: 'adventure', name: 'Adventure', emoji: '🛶', href: '/category/adventure', image: assetPath('/categories/adventure-ecotourism.jpg') },
  { id: 'hidden', name: 'Hidden Gems', emoji: '💎', href: '/explore', image: assetPath('/categories/culinary-rural.jpg') },
  { id: 'luxury', name: 'Luxury', emoji: '✨', href: '/category/urban', image: assetPath('/categories/urban-contemporary.jpg') },
];

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function DashboardCategoryGrid({ selectedId, onSelect }: Props) {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-12 md:mt-16">
      <h2 className="font-display-lux text-2xl md:text-3xl mb-6">Travel categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {DASHBOARD_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <Link
              href={cat.href}
              onClick={() => onSelect(cat.id)}
              className={`lux-category-card block group ${selectedId === cat.id ? 'lux-category-card--selected' : ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cat.image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="relative p-4 flex flex-col justify-end min-h-[140px] text-white">
                {selectedId === cat.id && (
                  <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[color:var(--lux-primary)] inline-flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </span>
                )}
                <span className="text-xl" aria-hidden>
                  {cat.emoji}
                </span>
                <span className="font-medium mt-1">{cat.name}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
