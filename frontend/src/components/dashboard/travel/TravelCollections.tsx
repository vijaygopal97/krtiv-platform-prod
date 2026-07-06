'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CIRCUIT_NAV } from '@/lib/siteNavigation';
import { categoryImage } from '@/lib/krtivPaths';

const IMAGES = ['historical-heritage.jpg', 'spiritual-pilgrimage.jpg', 'adventure-ecotourism.jpg', 'culinary-rural.jpg'];

export default function TravelCollections() {
  const collections = CIRCUIT_NAV.slice(0, 4).map((c, i) => ({
    ...c,
    image: categoryImage(IMAGES[i] || 'historical-heritage.jpg'),
    blurb: `Curated ${c.label.toLowerCase()} routes across Maharashtra.`,
  }));

  return (
    <section className="mt-10 mb-8">
      <h2 className="font-display-dash text-xl font-semibold text-[#1F2937] mb-5">Travel Collections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {collections.map((col, i) => (
          <motion.div
            key={col.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
          >
            <Link href={col.href} className="travel-dash-card block overflow-hidden group hover:shadow-[var(--dash-shadow-hover)] transition-shadow duration-250">
              <div className="h-28 overflow-hidden">
                <img src={col.image} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-[#1F2937]">{col.label}</h3>
                <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{col.blurb}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
