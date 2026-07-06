'use client';

import { useEffect, useMemo } from 'react';
import { CategoryHeroSection } from '@/components/krtiv/CategoryHeroSection';
import type { DestinationRecord } from '@/data/destinations';
import {
  getDestinationHero,
  getDestinationHeroImageUrl,
  getDestinationHeroSlides,
  preloadDestinationHeroSlides,
} from '@/data/destinationHeroImages';

export function PlaceHeroSection({ place }: { place: DestinationRecord }) {
  const heroSlides = useMemo(() => getDestinationHeroSlides(place.slug), [place.slug]);
  const mapped = getDestinationHero(place.slug);
  const image = getDestinationHeroImageUrl(place.slug, place.hero);
  const imageAlt = mapped?.alt ?? `${place.title}, Maharashtra`;

  useEffect(() => {
    preloadDestinationHeroSlides(place.slug);
  }, [place.slug]);

  return (
    <CategoryHeroSection
      category="urban"
      pageVideoScope=""
      staticHeroImage={heroSlides.length <= 1}
      placeHeroSlides={heroSlides.length > 1 ? heroSlides : undefined}
      showThemeAnimation={false}
      eyebrow="Curated Itineraries"
      title={place.title}
      subtitle={place.subtitle}
      image={image}
      imageAlt={imageAlt}
      primaryHref="#place-smart-itinerary"
      primaryLabel="Generate itinerary"
      secondaryHref="#itinerary-map"
      secondaryLabel="See the map"
    />
  );
}
