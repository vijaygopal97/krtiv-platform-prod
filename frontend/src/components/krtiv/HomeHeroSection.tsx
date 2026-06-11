"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/krtiv/HeroSection";
import { HomeHeroVideo } from "@/components/krtiv/HomeHeroVideo";
import { fetchPublicHeroSlides } from "@/lib/heroSlidesApi";
import { getDefaultSlidesForScope, HOME_SCOPE } from "@/data/heroSlidesData";
import { krtivHeroImage } from "@/lib/krtivPaths";
import type { HeroSlideRecord } from "@/lib/heroSlideTypes";

const FALLBACK = {
  eyebrow: "Discover Incredible Maharashtra",
  title: "You will find India here",
  subtitle:
    "Seven curated journeys across forts, ghats, coasts and quiet villages — written for travelers who like to read the place slowly.",
  image: krtivHeroImage(),
};

export function HomeHeroSection() {
  const [slides, setSlides] = useState<HeroSlideRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchPublicHeroSlides(HOME_SCOPE)
      .then((apiSlides) => {
        if (apiSlides.length > 0) {
          setSlides(apiSlides);
          return;
        }
        setSlides(getDefaultSlidesForScope(HOME_SCOPE));
      })
      .catch(() => setSlides(getDefaultSlidesForScope(HOME_SCOPE)))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <HeroSection
      slides={loaded && slides.length > 0 ? slides : undefined}
      eyebrow={FALLBACK.eyebrow}
      title={FALLBACK.title}
      subtitle={FALLBACK.subtitle}
      image={FALLBACK.image}
      videoTitle="Watch The Journey Through Maharashtra"
      videoMeta="Featured · Maharashtra Tourism"
      primaryHref="/#itinerary-generator"
      primaryLabel="Plan with AI"
      secondaryHref="/#explore-by-categories"
      secondaryLabel="Explore the state"
      exploreHref="/#explore-by-categories"
      exploreLabel="Explore itineraries"
      videoSlot={<HomeHeroVideo />}
      showThemeAnimation
      themeAnimationTheme="home"
    />
  );
}
