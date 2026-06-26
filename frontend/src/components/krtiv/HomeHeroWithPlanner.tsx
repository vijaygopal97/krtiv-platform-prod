'use client';

import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/krtiv/HeroSection';
import { fetchPublicHeroSlides } from '@/lib/heroSlidesApi';
import { getDefaultSlidesForScope, HOME_SCOPE } from '@/data/heroSlidesData';
import { krtivHeroImage } from '@/lib/krtivPaths';
import { HOME_HERO_HIGHLIGHT } from '@/lib/circuitHeroHeadings';
import type { HeroSlideRecord } from '@/lib/heroSlideTypes';

const FALLBACK = {
  eyebrow: 'Discover Incredible Maharashtra',
  title: 'You will find India here',
  subtitle:
    'Seven curated journeys across forts, ghats, coasts and quiet villages — written for travelers who like to read the place slowly.',
  image: krtivHeroImage(),
};

/** Home hero — full-bleed background video only (no side video card). */
export function HomeHeroWithPlanner() {
  const [slides, setSlides] = useState<HeroSlideRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchPublicHeroSlides(HOME_SCOPE)
      .then((apiSlides) => {
        if (apiSlides.length > 0) setSlides(apiSlides);
        else setSlides(getDefaultSlidesForScope(HOME_SCOPE));
      })
      .catch(() => setSlides(getDefaultSlidesForScope(HOME_SCOPE)))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <HeroSection
      pageVideoScope={HOME_SCOPE}
      slides={loaded && slides.length > 0 ? slides : undefined}
      eyebrow={FALLBACK.eyebrow}
      title={FALLBACK.title}
      subtitle={FALLBACK.subtitle}
      image={FALLBACK.image}
      luxuryHighlight={HOME_HERO_HIGHLIGHT}
      luxuryHeadingCentered
      primaryHref="#floating-interest-bubbles"
      primaryLabel="Plan with AI"
      secondaryHref="/explore#explore-smart-planner"
      secondaryLabel="Things to Do"
      showThemeAnimation
      themeAnimationTheme="home"
      pinnedReveal
    />
  );
}
