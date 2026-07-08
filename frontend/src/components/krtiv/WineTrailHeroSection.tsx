'use client';

import { CategoryHeroSection } from '@/components/krtiv/CategoryHeroSection';
import type { WineTrailRecord } from '@/data/wineTrailDestinations';

export function WineTrailHeroSection({ destination }: { destination: WineTrailRecord }) {
  return (
    <CategoryHeroSection
      category="culinary"
      pageVideoScope=""
      staticHeroImage
      showThemeAnimation={false}
      eyebrow={`Wine Trail · ${destination.trailLabel}`}
      title={destination.title}
      subtitle={destination.subtitle}
      image={destination.hero}
      imageAlt={`${destination.title}, Maharashtra`}
      primaryHref="#wine-smart-itinerary"
      primaryLabel="Generate itinerary"
      secondaryHref="#itinerary-map"
      secondaryLabel="See the map"
    />
  );
}
