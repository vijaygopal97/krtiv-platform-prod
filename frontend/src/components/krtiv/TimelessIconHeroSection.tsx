'use client';

import { useEffect, useMemo } from 'react';
import { CategoryHeroSection } from '@/components/krtiv/CategoryHeroSection';
import type { TimelessIconRecord } from '@/data/timelessIcons';
import {
  getTimelessIconHeroImageUrl,
  getTimelessIconHeroSlides,
  preloadTimelessIconHeroSlides,
} from '@/data/timelessIconHeroImages';

export function TimelessIconHeroSection({ site }: { site: TimelessIconRecord }) {
  const heroSlides = useMemo(() => getTimelessIconHeroSlides(site.slug), [site.slug]);
  const image = getTimelessIconHeroImageUrl(site.slug, site.hero);

  useEffect(() => {
    preloadTimelessIconHeroSlides(site.slug);
  }, [site.slug]);

  return (
    <CategoryHeroSection
      category="historical"
      pageVideoScope=""
      staticHeroImage={heroSlides.length <= 1}
      placeHeroSlides={heroSlides.length > 1 ? heroSlides : undefined}
      showThemeAnimation={false}
      eyebrow={`Timeless Icon · ${site.iconYear}`}
      title={site.title}
      subtitle={site.subtitle}
      image={image}
      imageAlt={`${site.title}, Maharashtra Timeless Icon`}
      primaryHref="#timeless-smart-itinerary"
      primaryLabel="Generate itinerary"
      secondaryHref="#itinerary-map"
      secondaryLabel="See the map"
    />
  );
}
