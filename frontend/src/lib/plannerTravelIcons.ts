export const INTEREST_ICON_MAP: Record<string, string[]> = {
  Heritage: ['fort', 'temple'],
  Pilgrimage: ['temple'],
  Adventure: ['mountain'],
  Culinary: ['culinary'],
  'Art, Craft & Culture': ['palette'],
  'Urban & Contemporary': ['skyline'],
  Weddings: ['rings'],
};

export const EXPLORE_CHIP_ICON: Record<string, string> = {
  Heritage: 'fort',
  Pilgrimage: 'temple',
  Adventure: 'mountain',
  Culinary: 'culinary',
  'Art, Craft & Culture': 'palette',
  'Urban & Contemporary': 'skyline',
  Weddings: 'rings',
};

export function exploreChipIconId(label: string): string {
  return EXPLORE_CHIP_ICON[label] ?? 'compass';
}

export type PlannerIconAnim = 'float' | 'gentleRotate' | 'fadePulse' | 'glowPulse';

export type PlannerIconDef = {
  id: string;
  categories: string[];
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: number;
  depth: 0.02 | 0.04 | 0.06;
  anims: PlannerIconAnim[];
  delay: string;
  duration: string;
  showMobile: boolean;
};

/** Icons sit in left/right columns — center kept clear for the wizard */
export const PLANNER_TRAVEL_ICONS: PlannerIconDef[] = [
  { id: 'compass', categories: [], top: '9%', left: '4%', size: 54, depth: 0.04, anims: ['float', 'gentleRotate', 'glowPulse'], delay: '0s', duration: '13s', showMobile: true },
  { id: 'plane', categories: [], top: '9%', right: '4%', size: 50, depth: 0.06, anims: ['float', 'fadePulse'], delay: '1.4s', duration: '11s', showMobile: true },
  { id: 'binoculars', categories: [], top: '11%', right: '11%', size: 44, depth: 0.02, anims: ['float', 'gentleRotate'], delay: '2.2s', duration: '14s', showMobile: false },
  { id: 'map', categories: ['Heritage'], top: '11%', left: '11%', size: 48, depth: 0.02, anims: ['float', 'fadePulse'], delay: '0.8s', duration: '12s', showMobile: false },
  { id: 'temple', categories: ['Heritage', 'Pilgrimage'], top: '28%', left: '3%', size: 58, depth: 0.02, anims: ['float', 'gentleRotate', 'glowPulse'], delay: '0.5s', duration: '15s', showMobile: true },
  { id: 'fort', categories: ['Heritage'], top: '28%', right: '3%', size: 60, depth: 0.04, anims: ['float', 'fadePulse'], delay: '1.9s', duration: '13.5s', showMobile: true },
  { id: 'mountain', categories: ['Adventure'], top: '46%', left: '5%', size: 52, depth: 0.04, anims: ['float', 'gentleRotate'], delay: '1.1s', duration: '11.5s', showMobile: true },
  { id: 'beach', categories: [], top: '46%', right: '5%', size: 50, depth: 0.02, anims: ['float', 'fadePulse'], delay: '2.6s', duration: '14s', showMobile: true },
  { id: 'forest', categories: [], top: '64%', left: '4%', size: 46, depth: 0.04, anims: ['float', 'glowPulse'], delay: '3.1s', duration: '12.5s', showMobile: false },
  { id: 'camera', categories: [], top: '64%', right: '4%', size: 46, depth: 0.06, anims: ['float', 'gentleRotate'], delay: '0.3s', duration: '13s', showMobile: false },
  { id: 'train', categories: ['Urban & Contemporary'], bottom: '14%', left: '6%', size: 52, depth: 0.06, anims: ['float', 'fadePulse'], delay: '1.7s', duration: '11s', showMobile: false },
  { id: 'backpack', categories: ['Adventure'], bottom: '14%', right: '6%', size: 44, depth: 0.02, anims: ['float', 'gentleRotate'], delay: '2.9s', duration: '15s', showMobile: false },
  { id: 'pin', categories: [], bottom: '8%', left: '12%', size: 42, depth: 0.04, anims: ['float', 'glowPulse'], delay: '0.6s', duration: '12s', showMobile: true },
  { id: 'peacock', categories: ['Art, Craft & Culture'], bottom: '8%', right: '12%', size: 42, depth: 0.04, anims: ['float', 'glowPulse'], delay: '2s', duration: '14.5s', showMobile: true },
  { id: 'dhol', categories: ['Art, Craft & Culture'], bottom: '22%', left: '3%', size: 44, depth: 0.02, anims: ['float', 'gentleRotate'], delay: '3.4s', duration: '13s', showMobile: false },
  { id: 'warli', categories: [], bottom: '22%', right: '3%', size: 40, depth: 0.02, anims: ['float', 'fadePulse'], delay: '1.2s', duration: '11.8s', showMobile: false },
  { id: 'culinary', categories: ['Culinary'], top: '78%', left: '8%', size: 40, depth: 0.06, anims: ['float', 'glowPulse'], delay: '2.4s', duration: '12.2s', showMobile: false },
  { id: 'sunrise', categories: ['Pilgrimage'], top: '78%', right: '8%', size: 40, depth: 0.02, anims: ['float', 'fadePulse'], delay: '0.9s', duration: '14.2s', showMobile: false },
];

export const PLANNER_PARTICLES: { top?: string; left?: string; right?: string; bottom?: string; delay: string; size: number }[] = [
  { top: '7%', left: '18%', delay: '0s', size: 4 },
  { top: '15%', right: '20%', delay: '1.2s', size: 3 },
  { top: '24%', left: '2%', delay: '2.1s', size: 5 },
  { top: '38%', right: '2%', delay: '0.4s', size: 4 },
  { top: '55%', left: '9%', delay: '3s', size: 3 },
  { top: '55%', right: '9%', delay: '1.8s', size: 4 },
  { bottom: '18%', left: '15%', delay: '2.6s', size: 3 },
  { bottom: '18%', right: '15%', delay: '0.7s', size: 5 },
  { bottom: '6%', left: '22%', delay: '1.5s', size: 3 },
  { bottom: '6%', right: '22%', delay: '2.9s', size: 4 },
  { top: '72%', left: '3%', delay: '1.1s', size: 3 },
  { top: '72%', right: '3%', delay: '2.3s', size: 4 },
];

export function iconIdsForInterestPulse(label: string): string[] {
  return INTEREST_ICON_MAP[label] ?? [];
}

export function iconIdsForSelectedInterests(interests: string[]): Set<string> {
  const ids = new Set<string>();
  for (const label of interests) {
    for (const id of INTEREST_ICON_MAP[label] ?? []) ids.add(id);
  }
  return ids;
}
