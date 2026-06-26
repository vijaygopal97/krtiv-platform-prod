"use client";

import type { HeroThemeKey } from "./ThemeAnimationLayer";

const PREMIUM_THEMES = new Set<HeroThemeKey>([
  "historical",
  "adventure",
  "culinary",
  "urban",
]);

type Props = {
  theme: HeroThemeKey;
};

/** Premium category heroes — CSS-only ambient layers (revert: remove component + CSS import). */
export function CategoryHeroAmbience({ theme }: Props) {
  if (!PREMIUM_THEMES.has(theme)) return null;

  if (theme === "historical") {
    return (
      <div aria-hidden className="hero-ambience-root pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="hero-ambience hero-ambience--heritage-rays" />
        <div className="hero-ambience hero-ambience--heritage-glow" />
        <div className="hero-ambience hero-ambience--heritage-dust" />
      </div>
    );
  }

  if (theme === "adventure") {
    return (
      <div aria-hidden className="hero-ambience-root pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="hero-ambience hero-ambience--adventure-cloud hero-ambience--cloud-a" />
        <div className="hero-ambience hero-ambience--adventure-cloud hero-ambience--cloud-b" />
        <div className="hero-ambience hero-ambience--adventure-fog" />
        <div className="hero-ambience hero-ambience--adventure-fireflies" />
      </div>
    );
  }

  if (theme === "culinary") {
    return (
      <div aria-hidden className="hero-ambience-root pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="hero-ambience hero-ambience--culinary-glow" />
        <div className="hero-ambience hero-ambience--culinary-steam hero-ambience--steam-a" />
        <div className="hero-ambience hero-ambience--culinary-steam hero-ambience--steam-b" />
        <div className="hero-ambience hero-ambience--culinary-spice" />
      </div>
    );
  }

  if (theme === "urban") {
    return (
      <div aria-hidden className="hero-ambience-root pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="hero-ambience hero-ambience--urban-skyline" />
        <div className="hero-ambience hero-ambience--urban-neon" />
        <div className="hero-ambience hero-ambience--urban-rain" />
        <div className="hero-ambience hero-ambience--urban-bokeh" />
      </div>
    );
  }

  return null;
}

export function isPremiumCategoryHeroTheme(theme: HeroThemeKey) {
  return PREMIUM_THEMES.has(theme);
}
