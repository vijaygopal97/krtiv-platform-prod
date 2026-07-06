'use client';

import { useEffect, useMemo } from 'react';
import { CategoryHeroSection } from '@/components/krtiv/CategoryHeroSection';
import type { WeekendGetawayRecord } from '@/data/weekendGetaways';
import {
  getDestinationHeroImageUrl,
  getDestinationHeroSlides,
  preloadDestinationHeroSlides,
} from '@/data/destinationHeroImages';

export function WeekendGetawayHeroSection({ getaway }: { getaway: WeekendGetawayRecord }) {
  const heroSlides = useMemo(() => getDestinationHeroSlides(getaway.slug), [getaway.slug]);
  const image = getDestinationHeroImageUrl(getaway.slug, getaway.hero);

  useEffect(() => {
    preloadDestinationHeroSlides(getaway.slug);
  }, [getaway.slug]);

  return (
    <CategoryHeroSection
      category="urban"
      pageVideoScope=""
      staticHeroImage={heroSlides.length <= 1}
      placeHeroSlides={heroSlides.length > 1 ? heroSlides : undefined}
      showThemeAnimation={false}
      eyebrow={`Weekend Getaways · ${getaway.tripLabel}`}
      title={getaway.title}
      subtitle={getaway.subtitle}
      image={image}
      imageAlt={`${getaway.title}, Maharashtra`}
      primaryHref="#weekend-smart-itinerary"
      primaryLabel="Generate itinerary"
      secondaryHref="#itinerary-map"
      secondaryLabel="See the map"
    />
  );
}
