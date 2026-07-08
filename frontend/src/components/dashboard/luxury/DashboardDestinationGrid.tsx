'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const DESTINATIONS = [
  {
    name: 'Mahabaleshwar',
    location: 'Satara · Hill station',
    desc: 'Strawberries, misty points, and slow monsoon drives.',
    duration: '3–4 days',
    rating: '4.8',
    href: '/places-to-go/mahabaleshwar',
    image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Alibaug',
    location: 'Raigad · Konkan coast',
    desc: 'Sea forts, coastal lunches, and ferry escapes from Mumbai.',
    duration: 'Weekend',
    rating: '4.7',
    href: '/journeys/konkan-slow-lunch',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Ajanta Caves',
    location: 'Chhatrapati Sambhajinagar · UNESCO',
    desc: 'Painted cliffs and two millennia of Buddhist art.',
    duration: '1–2 days',
    rating: '4.9',
    href: '/journeys/kohinoor-of-the-deccan',
    image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Tadoba',
    location: 'Chandrapur · Wildlife',
    desc: 'Tiger country, sal forests, and dawn safaris.',
    duration: '2–3 days',
    rating: '4.8',
    href: '/places-to-go/tadoba',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Kalsubai',
    location: 'Ahmednagar · Trekking',
    desc: 'Sunrise on Maharashtra&apos;s highest peak.',
    duration: '1 day',
    rating: '4.6',
    href: '/journeys/kalsubai-sunrise',
    image: 'https://images.pexels.com/photos/1647121/pexels-photo-1647121.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Kaas Plateau',
    location: 'Satara · Monsoon',
    desc: 'Wildflower carpets after the first rains.',
    duration: 'Day trip',
    rating: '4.7',
    href: '/explore',
    image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export function DashboardDestinationGrid() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-12 md:mt-16">
      <h2 className="font-display-lux text-2xl md:text-3xl mb-6">Recommended destinations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DESTINATIONS.map((d, i) => (
          <motion.article
            key={d.name}
            className="lux-card overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.32 }}
            whileHover={{ y: -8 }}
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.image}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display-lux text-xl">{d.name}</h3>
                  <p className="text-xs text-[color:var(--lux-muted)] mt-1">{d.location}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[color:var(--lux-primary-light)] text-[color:var(--lux-primary-light)]" />
                  {d.rating}
                </span>
              </div>
              <p className="text-sm text-[color:var(--lux-muted)] mt-3 leading-relaxed">{d.desc}</p>
              <p className="text-xs text-[color:var(--lux-muted)] mt-2">{d.duration}</p>
              <Link
                href={d.href}
                className="mt-4 inline-flex h-10 px-5 items-center rounded-full border border-[color:var(--lux-border)] text-sm font-semibold hover:border-[color:var(--lux-primary)] transition-colors"
              >
                Explore
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
