'use client';

import { HeroSection } from '@/components/krtiv/HeroSection';
import { assetPath } from '@/lib/basePath';

const COPY = {
  eyebrow: 'Things to Do',
  title: 'Find your Maharashtra — then plan it in minutes.',
  subtitle:
    'Pick interest tags below and generate a day-by-day AI travel plan tailored to how you want to explore the state.',
};

export function ExplorePageHero() {
  return (
    <HeroSection
      pageVideoScope="explore"
      eyebrow={COPY.eyebrow}
      title={COPY.title}
      subtitle={COPY.subtitle}
      image={assetPath('/categories/explorer/home-1.jpg')}
      primaryHref="#explore-smart-planner"
      primaryLabel="Plan with AI"
      secondaryHref="/#explore-by-categories"
      secondaryLabel="Browse circuits"
      showThemeAnimation
      themeAnimationTheme="home"
    />
  );
}
