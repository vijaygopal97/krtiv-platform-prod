"use client";

import { useEffect, useState, type ReactNode } from "react";
import { HeroSection } from "@/components/krtiv/HeroSection";
import { resolveHeroThemeKey } from "@/components/krtiv/ThemeAnimationLayer";
import { fetchPublicHeroSlides } from "@/lib/heroSlidesApi";
import { getDefaultSlidesForScope } from "@/data/heroSlidesData";
import { heroVideoScopeForCategory } from "@/config/heroVideos";
import { getCircuitHeroHighlight } from "@/lib/circuitHeroHeadings";
import type { HeroSlideRecord } from "@/lib/heroSlideTypes";

type Props = {
  category: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  pageVideoScope?: string;
  /** When true, use the provided image only (no hero slide carousel). */
  staticHeroImage?: boolean;
  showThemeAnimation?: boolean;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children?: ReactNode;
  /** When set, drives the in-hero destination slideshow (Places to Go). */
  placeHeroSlides?: HeroSlideRecord[];
};

export function CategoryHeroSection({
  category,
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  pageVideoScope,
  staticHeroImage = false,
  showThemeAnimation = true,
  children,
  placeHeroSlides,
  ...cta
}: Props) {
  const [slides, setSlides] = useState<HeroSlideRecord[]>([]);
  const [loaded, setLoaded] = useState(staticHeroImage);

  useEffect(() => {
    if (staticHeroImage) {
      setSlides([]);
      setLoaded(true);
      return;
    }
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
  }, [category, staticHeroImage]);

  const luxuryHighlight = getCircuitHeroHighlight(category);
  const destinationSlides =
    placeHeroSlides && placeHeroSlides.length > 0 ? placeHeroSlides : undefined;
  const carouselSlides =
    destinationSlides ?? (!staticHeroImage && loaded && slides.length > 0 ? slides : undefined);
  const useHeroCarousel = Boolean(carouselSlides?.length);

  return (
    <HeroSection
      pageVideoScope={
        useHeroCarousel
          ? ""
          : pageVideoScope !== undefined
            ? pageVideoScope
            : heroVideoScopeForCategory(category)
      }
      slides={
        destinationSlides ??
        (!staticHeroImage && loaded && slides.length > 0 ? slides : undefined)
      }
      heroSliderMode={destinationSlides ? "place" : "category"}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      image={image}
      imageAlt={imageAlt}
      luxuryHighlight={luxuryHighlight}
      luxuryHighlightRotate={Boolean(luxuryHighlight)}
      luxuryHeadingCentered
      heroLedeClassName={category === 'culinary' ? 'md:whitespace-nowrap text-balance max-md:whitespace-normal' : undefined}
      showThemeAnimation={showThemeAnimation}
      themeAnimationTheme={resolveHeroThemeKey(category)}
      {...cta}
    >
      {children}
    </HeroSection>
  );
}
