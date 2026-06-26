/** Highlight keyword for "You will find ___ here" on circuit category heroes. */
export const CIRCUIT_HERO_HIGHLIGHT: Record<string, string> = {
  historical: 'Pride',
  spiritual: 'Peace',
  adventure: 'Thrill',
  culinary: 'Flavour',
  'art-culture': 'Soul',
  urban: 'Dreams',
  weddings: 'Love',
};

export const HOME_HERO_HIGHLIGHT = 'India';

export function getCircuitHeroHighlight(categorySlug: string): string | undefined {
  return CIRCUIT_HERO_HIGHLIGHT[categorySlug];
}
