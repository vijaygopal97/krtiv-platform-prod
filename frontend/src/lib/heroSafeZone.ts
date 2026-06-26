/**
 * Configurable safe zones for hero overlay copy vs. video focal content.
 * Swap videos by updating object position / anchor here — not layout code.
 */
export type HeroContentAnchor = 'upper' | 'center' | 'lower';

export type HeroSafeZoneConfig = {
  /** Vertical placement of headline block inside the hero */
  contentAnchor: HeroContentAnchor;
  textAlign: 'left' | 'center';
  /** CSS object-position for cover video/poster */
  videoObjectPosition: string;
  /** Disable scroll parallax on the background video */
  pinVideo: boolean;
  scrim: {
    centerX: number;
    centerY: number;
    /** 0–1 peak darkness behind copy */
    strength: number;
  };
  /** Extra bottom padding for CTAs (px-ish scale via rem in CSS) */
  contentPaddingBottom?: string;
};

const DEFAULT: HeroSafeZoneConfig = {
  contentAnchor: 'center',
  textAlign: 'left',
  videoObjectPosition: '50% 45%',
  pinVideo: false,
  scrim: { centerX: 50, centerY: 50, strength: 0.35 },
};

/** Home hero: keep center of frame clear for logo / key art in the video. */
const HOME: HeroSafeZoneConfig = {
  contentAnchor: 'lower',
  textAlign: 'center',
  videoObjectPosition: '50% 42%',
  pinVideo: true,
  scrim: {
    centerX: 50,
    centerY: 82,
    strength: 0.62,
  },
  contentPaddingBottom: 'clamp(4.5rem, 14vh, 7rem)',
};

const BY_SCOPE: Record<string, HeroSafeZoneConfig> = {
  home: HOME,
};

export function getHeroSafeZone(scope?: string): HeroSafeZoneConfig {
  if (!scope) return DEFAULT;
  return BY_SCOPE[scope] ?? DEFAULT;
}

export function usesHeroSafeZone(scope?: string): boolean {
  return Boolean(scope && BY_SCOPE[scope]);
}
