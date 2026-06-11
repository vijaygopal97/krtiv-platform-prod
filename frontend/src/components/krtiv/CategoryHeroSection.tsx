"use client";

import { useEffect, useState, type ReactNode } from "react";
import { HeroSection } from "@/components/krtiv/HeroSection";
import { resolveHeroThemeKey } from "@/components/krtiv/ThemeAnimationLayer";
import { fetchPublicHeroSlides } from "@/lib/heroSlidesApi";
import { getDefaultSlidesForScope } from "@/data/heroSlidesData";
import type { HeroSlideRecord } from "@/lib/heroSlideTypes";

type Props = {
  category: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  videoTitle?: string;
  videoMeta?: string;
  videoPoster?: string;
  exploreHref?: string;
  exploreLabel?: string;
  videoSlot?: ReactNode;
};

export function CategoryHeroSection({
  category,
  eyebrow,
  title,
  subtitle,
  image,
  ...rest
}: Props) {
  const [slides, setSlides] = useState<HeroSlideRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchPublicHeroSlides(category)
      .then((apiSlides) => {
        if (apiSlides.length > 0) {
          setSlides(apiSlides);
          return;
        }
        setSlides(getDefaultSlidesForScope(category));
      })
      .catch(() => setSlides(getDefaultSlidesForScope(category)))
      .finally(() => setLoaded(true));
  }, [category]);

  return (
    <HeroSection
      slides={loaded && slides.length > 0 ? slides : undefined}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      image={image}
      showThemeAnimation
      themeAnimationTheme={resolveHeroThemeKey(category)}
      {...rest}
    />
  );
}
