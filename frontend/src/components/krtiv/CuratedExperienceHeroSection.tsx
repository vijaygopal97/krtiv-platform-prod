'use client';

import { useMemo } from 'react';
import { CategoryHeroSection } from '@/components/krtiv/CategoryHeroSection';
import type { CuratedExperienceRecord, CuratedExperienceTrail } from '@/data/curatedExperiences';
import type { HeroSlideRecord } from '@/lib/heroSlideTypes';

const TRAIL_LABEL: Record<CuratedExperienceTrail, string> = {
  'nature-trails': 'Nature Trails',
  'monsoon-trails': 'Monsoon Trails',
};

export function CuratedExperienceHeroSection({
  guide,
  trail,
}: {
  guide: CuratedExperienceRecord;
  trail: CuratedExperienceTrail;
}) {
  const heroSlides = useMemo((): HeroSlideRecord[] => {
    return guide.gallery.slice(0, 4).map((src, i) => ({
      _id: `experience-${guide.slug}-hero-${i + 1}`,
      imageUrl: src,
      alt: `${guide.title} — ${i + 1}`,
      title: guide.title,
    }));
  }, [guide.gallery, guide.slug, guide.title]);
  const image = guide.hero ?? guide.gallery[0];

  return (
    <CategoryHeroSection
      category="adventure"
      pageVideoScope=""
      staticHeroImage={heroSlides.length <= 1}
      placeHeroSlides={heroSlides.length > 1 ? heroSlides : undefined}
      showThemeAnimation={false}
      eyebrow={`${TRAIL_LABEL[trail]} · ${guide.experienceLabel}`}
      title={guide.title}
      subtitle={guide.subtitle}
      image={image}
      imageAlt={`${guide.title}, Maharashtra`}
      primaryHref="#experience-smart-itinerary"
      primaryLabel="Generate itinerary"
      secondaryHref="#itinerary-map"
      secondaryLabel="See the map"
    />
  );
}
