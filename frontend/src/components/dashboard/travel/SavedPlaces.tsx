'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { getDestination } from '@/data/destinations';
import { assetPath } from '@/lib/basePath';
import { displayNameForSlug, isDestinationSlug } from '@/lib/savePlaceSlug';
import type { SavedPlaceMeta } from '@/lib/savePlaceSlug';
import { getAccountCache, loadAccountSavedPlaces, removeAccountSavedPlace } from '@/lib/savedPlacesAccount';
import { authService } from '@/services/authService';
import type { ItineraryJobRequest } from '@/lib/signpostApi';
import SavedPlaceCard, { type SavedPlaceView } from './SavedPlaceCard';
import SavedPlacesRoutePlanner from './SavedPlacesRoutePlanner';

const RATING_BY_SLUG: Record<string, string> = {
  mahabaleshwar: '4.9',
  alibaug: '4.7',
  mumbai: '4.8',
  pune: '4.8',
  'ajanta-ellora': '4.9',
  lonavala: '4.6',
};

function seasonBadgeFromBestTime(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('monsoon')) return 'Monsoon';
  if (t.includes('winter') || t.includes('november') || t.includes('october')) return 'Winter';
  if (t.includes('summer')) return 'Summer';
  return 'Best season';
}

function categoryToTravelStyle(category: string): string {
  const c = category.toLowerCase();
  if (c.includes('coast') || c.includes('sea') || c.includes('hill') || c.includes('ghat')) return 'Nature';
  if (c.includes('wine') || c.includes('culture')) return 'Cultural';
  if (c.includes('sacred') || c.includes('temple')) return 'Spiritual';
  if (c.includes('city') || c.includes('maximum')) return 'Urban';
  return 'Relaxed';
}

function metaToView(meta: SavedPlaceMeta, index: number): SavedPlaceView | null {
  const dest = isDestinationSlug(meta.slug) ? getDestination(meta.slug) : undefined;
  const name = dest?.title || displayNameForSlug(meta.slug, meta.title);
  const description = dest?.description || meta.locationLabel || 'Saved from your exploration.';
  const image = meta.image || dest?.hero || assetPath('/places/heroes/mumbai.jpg');
  const category =
    meta.source === 'explore-photo'
      ? 'Liked photo'
      : dest?.subtitle?.split('—')[0]?.trim() || meta.source || 'Saved place';
  const map = dest?.map;
  const mapUrl = map
    ? `https://www.google.com/maps/search/?api=1&query=${map.lat},${map.lng}`
    : meta.lat != null && meta.lng != null
      ? `https://www.google.com/maps/search/?api=1&query=${meta.lat},${meta.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;

  return {
    slug: meta.slug,
    name,
    location: meta.locationLabel || 'Maharashtra, India',
    category,
    description,
    distance: index >= 0 ? `${110 + index * 38} km from Mumbai` : undefined,
    rating: RATING_BY_SLUG[meta.slug] || '4.7',
    seasonBadge: dest ? seasonBadgeFromBestTime(dest.bestTimeToVisit || '') : 'Saved',
    image,
    mapUrl,
  };
}

export type SavedPlacePlanRequest = {
  destination: string;
  travelStyle: string;
  autoGenerate: boolean;
};

type Props = {
  onPlanWithAI: (req: SavedPlacePlanRequest) => void;
  onAddToTrip: (destination: string) => void;
  onAddToItinerary: (destination: string) => void;
  onGenerateRoute?: (payload: ItineraryJobRequest) => void;
  isGenerating?: boolean;
  showRoutePlanner?: boolean;
  fullPage?: boolean;
};

export default function SavedPlaces({
  onPlanWithAI,
  onAddToTrip,
  onAddToItinerary,
  onGenerateRoute,
  isGenerating,
  showRoutePlanner = false,
  fullPage = false,
}: Props) {
  const [placesMeta, setPlacesMeta] = useState<SavedPlaceMeta[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    const user = authService.getCurrentUser();
    if (!user?.token) {
      setPlacesMeta([]);
      return;
    }
    if (!getAccountCache().length) {
      await loadAccountSavedPlaces();
    }
    setPlacesMeta(getAccountCache());
  }, []);

  useEffect(() => {
    let cancelled = false;
    setSyncing(true);
    void (async () => {
      const user = authService.getCurrentUser();
      if (user?.token && !getAccountCache().length) {
        await loadAccountSavedPlaces();
      }
      if (!cancelled) {
        setPlacesMeta(user?.token ? getAccountCache() : []);
        setHydrated(true);
        setSyncing(false);
      }
    })();

    const sync = () => {
      void refresh();
    };
    window.addEventListener('dash-saved-places-changed', sync);
    return () => {
      cancelled = true;
      window.removeEventListener('dash-saved-places-changed', sync);
    };
  }, [refresh]);

  const places = useMemo(
    () => placesMeta.map((meta, i) => metaToView(meta, i)).filter((p): p is SavedPlaceView => p != null),
    [placesMeta],
  );

  const handleRemove = async (slug: string) => {
    await removeAccountSavedPlace(slug);
    await refresh();
  };

  if (!hydrated) {
    return (
      <section>
        <h2 className="font-display-dash text-lg font-semibold text-[#1F2937] mb-4">Saved Places</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="h-80 travel-dash-skeleton rounded-[20px]" />
          ))}
        </div>
      </section>
    );
  }

  if (!places.length) {
    return (
      <section className={`travel-dash-card p-10 md:p-12 text-center ${fullPage ? '' : ''}`}>
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C46B2D]/10 text-[#C46B2D] grid place-items-center mb-4">
          <Heart className="w-7 h-7" />
        </div>
        <h2 className="font-display-dash text-xl font-semibold text-[#1F2937]">No saved places yet</h2>
        <p className="text-sm text-[#6B7280] mt-2 max-w-md mx-auto">
          Sign in and tap the heart on destinations, travel stories, and guides — they are saved to your account.
        </p>
        <Link
          href="/places-to-go"
          className="inline-flex mt-6 h-11 px-6 items-center rounded-xl bg-[#C46B2D] text-white text-sm font-semibold hover:brightness-105 transition-all duration-250"
        >
          Explore Destinations
        </Link>
      </section>
    );
  }

  return (
    <section>
      {!fullPage ? (
        <h2 className="font-display-dash text-lg font-semibold text-[#1F2937] mb-4">Saved Places</h2>
      ) : null}
      {syncing ? <p className="text-xs text-[#9CA3AF] mb-3">Syncing with your account…</p> : null}
      {showRoutePlanner && onGenerateRoute ? (
        <SavedPlacesRoutePlanner places={placesMeta} onGenerate={onGenerateRoute} disabled={isGenerating} />
      ) : null}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {places.map((place, i) => (
          <SavedPlaceCard
            key={place.slug}
            place={place}
            index={i}
            onRemove={(slug) => void handleRemove(slug)}
            onAddToTrip={(p) => onAddToTrip(p.name)}
            onAddToItinerary={(p) => onAddToItinerary(p.name)}
            onPlanWithAI={(p) =>
              onPlanWithAI({
                destination: p.name,
                travelStyle: categoryToTravelStyle(p.category),
                autoGenerate: true,
              })
            }
          />
        ))}
      </div>
    </section>
  );
}
