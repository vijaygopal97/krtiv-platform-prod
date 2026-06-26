'use client';

import { CategoryHeroSection } from '@/components/krtiv/CategoryHeroSection';
import type { DestinationRecord } from '@/data/destinations';

export function PlaceHeroSection({ place }: { place: DestinationRecord }) {
  return (
    <CategoryHeroSection
      category="urban"
      staticHeroImage
      showThemeAnimation={false}
      eyebrow="Places to Go"
      title={place.title}
      subtitle={place.subtitle}
      image={place.hero}
      primaryHref="#suggested-itinerary"
      primaryLabel="View itinerary"
      secondaryHref="#itinerary-map"
      secondaryLabel="See the map"
    />
  );
}
