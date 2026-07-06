'use client';

import { resolveSaveSlug } from '@/lib/savePlaceSlug';
import { PlaceFavoriteButton } from '@/components/places/PlaceFavoriteButton';

type Props = {
  location: string;
  image?: string;
  lat?: number;
  lng?: number;
};

export function ItineraryDayFavorite({ location, image, lat, lng }: Props) {
  const slug = resolveSaveSlug({ locationLabel: location, slug: location.toLowerCase().replace(/\s+/g, '-') });
  return (
    <PlaceFavoriteButton
      slug={slug}
      title={location}
      image={image}
      locationLabel={location}
      source="itinerary-day"
      lat={lat}
      lng={lng}
      className="!bg-black/40 !text-white backdrop-blur-sm border border-white/25"
      size="sm"
    />
  );
}
