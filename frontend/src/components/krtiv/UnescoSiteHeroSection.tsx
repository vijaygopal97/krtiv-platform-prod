'use client';

import { useEffect, useMemo } from 'react';
import { CategoryHeroSection } from '@/components/krtiv/CategoryHeroSection';
import type { UnescoSiteRecord } from '@/data/unescoSites';
import {
  getUnescoHeroImageUrl,
  getUnescoHeroSlides,
  preloadUnescoHeroSlides,
} from '@/data/unescoHeroImages';

export function UnescoSiteHeroSection({ site }: { site: UnescoSiteRecord }) {
  const heroSlides = useMemo(() => getUnescoHeroSlides(site.slug), [site.slug]);
  const image = getUnescoHeroImageUrl(site.slug, site.hero);

  useEffect(() => {
    preloadUnescoHeroSlides(site.slug);
  }, [site.slug]);

  return (
    <CategoryHeroSection
      category="historical"
      pageVideoScope=""
      staticHeroImage={heroSlides.length <= 1}
      placeHeroSlides={heroSlides.length > 1 ? heroSlides : undefined}
      showThemeAnimation={false}
      eyebrow={`UNESCO World Heritage · ${site.unescoYear}`}
      title={site.title}
      subtitle={site.subtitle}
      image={image}
      imageAlt={`${site.title}, Maharashtra UNESCO site`}
      primaryHref="#unesco-smart-itinerary"
      primaryLabel="Generate itinerary"
      secondaryHref="#itinerary-map"
      secondaryLabel="See the map"
    />
  );
}
