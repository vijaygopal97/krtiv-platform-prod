'use client';

import Link from 'next/link';
import { useSavedPlacesList } from '@/hooks/useSavedPlace';
import { motion } from 'framer-motion';
import { ArrowUpRight, Star } from 'lucide-react';
import { getDestination } from '@/data/destinations';
import { PLACES_NAV } from '@/lib/siteNavigation';
import { assetPath } from '@/lib/basePath';
import { PlaceFavoriteButton } from '@/components/places/PlaceFavoriteButton';

const PICKS = ['mahabaleshwar', 'alibaug', 'ajanta-ellora', 'chandrapur', 'lonavala', 'sindhudurg'];

export default function RecommendedDestinations() {
  useSavedPlacesList();

  const cards = PICKS.map((slug) => {
    const nav = PLACES_NAV.find((p) => p.slug === slug);
    const dest = getDestination(slug);
    return {
      slug,
      name: nav?.label || dest?.title || slug,
      description: dest?.description || 'Discover Maharashtra.',
      image: dest?.hero || assetPath('/places/heroes/mumbai.jpg'),
      rating: '4.8',
      duration: '3–5 days',
    };
  });

  return (
    <section className="mt-10">
      <h2 className="font-display-dash text-xl font-semibold text-[#1F2937] mb-5">Recommended Destinations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <motion.article
            key={c.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="travel-dash-card overflow-hidden flex flex-col"
          >
            <div className="relative h-44 overflow-hidden group">
              <img src={c.image} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <PlaceFavoriteButton
                slug={c.slug}
                title={c.name}
                image={c.image}
                source="recommended"
                className="absolute top-3 right-3"
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-lg text-[#1F2937]">{c.name}</h3>
              <p className="text-sm text-[#6B7280] mt-2 line-clamp-2 flex-1">{c.description}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-[#6B7280]">
                <span className="inline-flex items-center gap-1 text-[#C46B2D] font-medium">
                  <Star className="w-3.5 h-3.5 fill-current" /> {c.rating}
                </span>
                <span>{c.duration}</span>
              </div>
              <Link
                href={`/places-to-go/${c.slug}`}
                className="mt-4 inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-[#E5E7EB] text-sm font-semibold hover:border-[#C46B2D] hover:text-[#C46B2D] transition-colors duration-250"
              >
                Explore
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
