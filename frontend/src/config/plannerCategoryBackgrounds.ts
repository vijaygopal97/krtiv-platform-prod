/**
 * Royalty-free Unsplash landscape URLs (hotlink per Unsplash guidelines).
 * Optional: set UNSPLASH_ACCESS_KEY server-side for dynamic photos via /planner-background.
 */
export type PlannerBackgroundKey =
  | 'default'
  | 'heritage'
  | 'pilgrimage'
  | 'adventure'
  | 'culinary'
  | 'art-culture'
  | 'urban'
  | 'weddings';

const unsplash = (photoId: string, w = 1920) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&q=75`;

/** Primary + alternate for preload rotation */
export const PLANNER_CATEGORY_BACKGROUNDS: Record<PlannerBackgroundKey, string[]> = {
  default: [
    unsplash('photo-1506905925346-21bda4d32df4'),
    unsplash('photo-1469474968028-56623f02e42e'),
  ],
  heritage: [
    unsplash('photo-1524492412937-280ceb786cbf'),
    unsplash('photo-1548013146-72479768bada'),
  ],
  pilgrimage: [
    unsplash('photo-1588668216262-cb87604c3745'),
    unsplash('photo-1565193566173-7a0ee3dbe261'),
  ],
  adventure: [
    unsplash('photo-1439069578443-ffad93f2fe20'),
    unsplash('photo-1501785888041-af3ef285b470'),
  ],
  culinary: [
    unsplash('photo-1585937421612-70a008356fbe'),
    unsplash('photo-1606491956689-2ea8668f67e2'),
  ],
  'art-culture': [
    unsplash('photo-1526483360412-daa3289b109b'),
    unsplash('photo-1533174072545-7a4b6d7f03cc'),
  ],
  urban: [
    unsplash('photo-1564507592333-c60657eea523'),
    unsplash('photo-1517154420450-3513ef46b458'),
  ],
  weddings: [
    unsplash('photo-1519741497674-611481863552'),
    unsplash('photo-1465495976277-4387d4b0b4c6'),
  ],
};

const INTEREST_TO_KEY: Record<string, PlannerBackgroundKey> = {
  Heritage: 'heritage',
  Pilgrimage: 'pilgrimage',
  Adventure: 'adventure',
  Culinary: 'culinary',
  'Art, Craft & Culture': 'art-culture',
  'Urban & Contemporary': 'urban',
  Weddings: 'weddings',
};

export function plannerKeyForInterest(label: string): PlannerBackgroundKey {
  return INTEREST_TO_KEY[label] ?? 'default';
}

export function plannerKeyFromInterests(interests: string[]): PlannerBackgroundKey {
  if (interests.length === 0) return 'default';
  return plannerKeyForInterest(interests[interests.length - 1]!);
}

export function plannerBackgroundUrl(key: PlannerBackgroundKey, variant = 0): string {
  const list = PLANNER_CATEGORY_BACKGROUNDS[key];
  return list[variant % list.length] ?? PLANNER_CATEGORY_BACKGROUNDS.default[0]!;
}

export const PLANNER_MASCOT_MESSAGES = [
  'Great choice!',
  "Let's explore!",
  'Planning your adventure...',
  'Maharashtra awaits!',
  'Love that pick!',
] as const;
