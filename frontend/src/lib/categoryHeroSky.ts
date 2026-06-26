import type { HeroThemeKey } from "@/components/krtiv/ThemeAnimationLayer";

/** Category + home (Explore) heroes use the subtle ambient canvas layer. */
export const CATEGORY_AMBIENT_THEMES = new Set<HeroThemeKey>([
  "home",
  "historical",
  "adventure",
  "culinary",
  "art-culture",
  "urban",
  "weddings",
  "spiritual",
]);

export function isCategoryHeroAmbientTheme(theme: HeroThemeKey): boolean {
  return CATEGORY_AMBIENT_THEMES.has(theme);
}

/** @deprecated Use isCategoryHeroAmbientTheme */
export const isCategoryHeroSkyTheme = isCategoryHeroAmbientTheme;

/** Brand palette — no bright white / neon */
export const AMBIENT_COLORS = {
  gold: "232, 201, 138", // #E8C98A
  amber: "217, 176, 111", // #D9B06F
  ivory: "245, 241, 232", // #F5F1E8
  blue: "221, 231, 245", // #DDE7F5
} as const;

export type AmbientMotionKind =
  | "dust"
  | "mist"
  | "steam"
  | "float"
  | "streak"
  | "bokeh"
  | "glow"
  | "divine";

export type AmbientThemeProfile = {
  motion: AmbientMotionKind;
  colors: string[];
  /** Share of particles using secondary motion (0–1) */
  accentRatio: number;
};

const PROFILES: Record<HeroThemeKey, AmbientThemeProfile> = {
  home: {
    motion: "glow",
    colors: [AMBIENT_COLORS.ivory, AMBIENT_COLORS.gold],
    accentRatio: 0.35,
  },
  historical: {
    motion: "dust",
    colors: [AMBIENT_COLORS.gold, AMBIENT_COLORS.amber],
    accentRatio: 0.2,
  },
  adventure: {
    motion: "mist",
    colors: [AMBIENT_COLORS.blue, AMBIENT_COLORS.ivory],
    accentRatio: 0.4,
  },
  culinary: {
    motion: "steam",
    colors: [AMBIENT_COLORS.amber, AMBIENT_COLORS.ivory],
    accentRatio: 0.25,
  },
  "art-culture": {
    motion: "float",
    colors: [AMBIENT_COLORS.ivory, AMBIENT_COLORS.gold],
    accentRatio: 0.3,
  },
  urban: {
    motion: "streak",
    colors: [AMBIENT_COLORS.blue, AMBIENT_COLORS.ivory],
    accentRatio: 0.15,
  },
  weddings: {
    motion: "bokeh",
    colors: [AMBIENT_COLORS.gold, AMBIENT_COLORS.amber],
    accentRatio: 0.35,
  },
  spiritual: {
    motion: "divine",
    colors: [AMBIENT_COLORS.ivory, AMBIENT_COLORS.gold],
    accentRatio: 0.25,
  },
};

export function getAmbientThemeProfile(theme: HeroThemeKey): AmbientThemeProfile {
  return PROFILES[theme] ?? PROFILES.home;
}
