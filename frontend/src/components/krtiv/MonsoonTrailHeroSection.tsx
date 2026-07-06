'use client';

import { useEffect, useMemo } from 'react';
import { CategoryHeroSection } from '@/components/krtiv/CategoryHeroSection';
import type { MonsoonTrailRecord } from '@/data/monsoonTrails';
import {
  getMonsoonHeroImageUrl,
  getMonsoonHeroSlides,
  preloadMonsoonHeroSlides,
} from '@/data/monsoonHeroImages';

export function MonsoonTrailHeroSection({ site }: { site: MonsoonTrailRecord }) {
  const heroSlides = useMemo(() => getMonsoonHeroSlides(site.slug), [site.slug]);
  const image = getMonsoonHeroImageUrl(site.slug, site.hero);

  useEffect(() => {
    preloadMonsoonHeroSlides(site.slug);
  }, [site.slug]);

  return (
    <CategoryHeroSection
      category="adventure"
      pageVideoScope=""
      staticHeroImage={heroSlides.length <= 1}
      placeHeroSlides={heroSlides.length > 1 ? heroSlides : undefined}
      showThemeAnimation={false}
      eyebrow={`Monsoon Trails · ${site.experienceLabel}`}
      title={site.title}
      subtitle={site.subtitle}
      image={image}
      imageAlt={`${site.title}, Maharashtra monsoon trail`}
      primaryHref="#monsoon-smart-itinerary"
      primaryLabel="Generate itinerary"
      secondaryHref="#itinerary-map"
      secondaryLabel="See the map"
    />
  );
}
