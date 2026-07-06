'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isDestinationSlug } from '@/lib/savePlaceSlug';
import {
  ArrowRight,
  Bot,
  Heart,
  HeartOff,
  MapPin,
  MoreVertical,
  Plus,
  Share2,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react';

export type SavedPlaceView = {
  slug: string;
  name: string;
  location: string;
  category: string;
  description: string;
  distance?: string;
  rating: string;
  seasonBadge: string;
  image: string;
  mapUrl: string;
};

type Props = {
  place: SavedPlaceView;
  index: number;
  onPlanWithAI: (place: SavedPlaceView) => void;
  onAddToTrip: (place: SavedPlaceView) => void;
  onAddToItinerary: (place: SavedPlaceView) => void;
  onRemove: (slug: string) => void;
};

export default function SavedPlaceCard({
  place,
  index,
  onPlanWithAI,
  onAddToTrip,
  onAddToItinerary,
  onRemove,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const unsave = useCallback(() => {
    onRemove(place.slug);
    setMenuOpen(false);
  }, [onRemove, place.slug]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || menuButtonRef.current?.contains(t)) return;
      setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const openMenu = () => {
    const btn = menuButtonRef.current;
    if (btn) {
      const r = btn.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 8, left: Math.max(8, r.right - 208) });
    }
    setMenuOpen((v) => !v);
  };

  const sharePlace = async () => {
    const url = `${window.location.origin}/places-to-go/${place.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: place.name, text: place.description, url });
        setMenuOpen(false);
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
    setMenuOpen(false);
  };

  const hoverActions = [
    { id: 'map', label: 'View on Map', icon: MapPin, onClick: () => window.open(place.mapUrl, '_blank', 'noopener') },
    { id: 'ai', label: 'Plan with AI', icon: Bot, onClick: () => onPlanWithAI(place) },
    { id: 'add', label: 'Add to Itinerary', icon: Plus, onClick: () => onAddToItinerary(place) },
    { id: 'unsave', label: 'Unsave', icon: HeartOff, onClick: unsave },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="travel-dash-card overflow-visible group shadow-[var(--dash-shadow)] hover:shadow-[var(--dash-shadow-hover)] transition-shadow duration-250"
    >
      <div className="relative h-44 sm:h-48 overflow-hidden rounded-t-[20px]">
        <img
          src={place.image}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        <button
          type="button"
          aria-label="Unsave destination"
          title="Remove from saved places"
          onClick={unsave}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 shadow-md grid place-items-center text-[#C46B2D] hover:scale-105 hover:bg-red-50 hover:text-red-600 transition-all duration-250"
        >
          <Heart className="w-5 h-5 fill-current" />
        </button>

        <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/95 text-[#1F2937]">
          {place.seasonBadge}
        </span>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250">
          {hoverActions.map((action, i) => (
            <motion.button
              key={action.id}
              type="button"
              initial={{ opacity: 0, scale: 0.85 }}
              whileHover={{ scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              title={action.label}
              onClick={action.onClick}
              className={`w-10 h-10 rounded-full bg-white/95 shadow-lg grid place-items-center ${
                action.id === 'unsave' ? 'text-red-600 hover:bg-red-50' : 'text-[#1F2937] hover:text-[#C46B2D]'
              }`}
            >
              <action.icon className="w-4 h-4" />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-5 space-y-3 rounded-b-[20px] bg-white">
        <div>
          <h3 className="font-semibold text-[#1F2937] text-base">{place.name}</h3>
          <p className="text-xs text-[#6B7280] mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {place.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#C46B2D]/10 text-[#C46B2D]">{place.category}</span>
          <span className="inline-flex items-center gap-1 text-xs text-[#6B7280]">
            <Star className="w-3.5 h-3.5 text-[#F4A261] fill-[#F4A261]" />
            {place.rating}
          </span>
          {place.distance && <span className="text-xs text-[#9CA3AF]">{place.distance}</span>}
        </div>

        <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2">{place.description}</p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {isDestinationSlug(place.slug) ? (
            <Link
              href={`/places-to-go/${place.slug}`}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#C46B2D] text-white text-sm font-semibold hover:brightness-105 transition-all duration-250 flex-1 min-w-[140px]"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => window.open(place.mapUrl, '_blank', 'noopener')}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#C46B2D] text-white text-sm font-semibold hover:brightness-105 transition-all duration-250 flex-1 min-w-[140px]"
            >
              View on Map
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onAddToTrip(place)}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#1F2937] hover:border-[#C46B2D]/40 transition-colors duration-250"
          >
            <Plus className="w-4 h-4" />
            Add to Trip
          </button>
          <button
            type="button"
            onClick={unsave}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#6B7280] hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors duration-250"
            title="Remove from saved places"
          >
            <HeartOff className="w-4 h-4" />
            Unsave
          </button>
          <button
            type="button"
            ref={menuButtonRef}
            aria-label="More options"
            aria-expanded={menuOpen}
            onClick={openMenu}
            className="w-10 h-10 rounded-xl border border-[#E5E7EB] grid place-items-center hover:bg-[#F8F9FB] transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }}
            className="w-52 travel-dash-card py-1.5 shadow-xl z-[100]"
          >
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-medium border-b border-[#E5E7EB]"
              onClick={unsave}
            >
              <HeartOff className="w-4 h-4" /> Unsave destination
            </button>
            <Link
              href={`/places-to-go/${place.slug}`}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#F8F9FB]"
              onClick={() => setMenuOpen(false)}
            >
              <Sparkles className="w-4 h-4 text-[#6B7280]" /> Open Destination
            </Link>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#F8F9FB]"
              onClick={() => {
                onAddToTrip(place);
                setMenuOpen(false);
              }}
            >
              <Plus className="w-4 h-4 text-[#6B7280]" /> Add to Trip
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#F8F9FB]"
              onClick={() => {
                onPlanWithAI(place);
                setMenuOpen(false);
              }}
            >
              <Bot className="w-4 h-4 text-[#6B7280]" /> Plan with AI
            </button>
            <button type="button" className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#F8F9FB]" onClick={() => void sharePlace()}>
              <Share2 className="w-4 h-4 text-[#6B7280]" /> Share
            </button>
            <button type="button" className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50" onClick={unsave}>
              <Trash2 className="w-4 h-4" /> Remove from Saved
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
