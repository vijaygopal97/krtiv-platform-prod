import type { TimelessIconSlug } from '@/data/timelessIcons';
import type { UnescoSiteSlug } from '@/data/unescoSites';

export const UNESCO_SITE_FACTS: Record<UnescoSiteSlug, readonly string[]> = {
  'ajanta-caves': [
    'The Ajanta Caves lay hidden beneath dense forest for nearly 1,300 years before being rediscovered by accident during a tiger hunt in 1819.',
  ],
  'ellora-caves': [
    'Ellora is one of the few places in the world where Buddhist, Hindu, and Jain monuments stand side by side, carved into the same cliff.',
  ],
  'elephanta-caves': [
    'Elephanta Island wasn\'t originally called "Elephanta." Portuguese explorers named it after discovering a massive stone elephant near the shore.',
  ],
  csmt: [
    'If you look closely at the station\'s entrance, you\'ll spot a lion and a tiger, symbolising Britain and India respectively.',
  ],
  'western-ghats': [
    'The Western Ghats cover 6% of India\'s land area, but are home to nearly 30% of the country\'s plant, animal, bird, fish and reptile species. Scientists still discover new species in the Western Ghats almost every year.',
  ],
  'art-deco-mumbai': [
    'Mumbai boasts the world\'s second-largest collection of Art Deco buildings, surpassed only by Miami.',
  ],
  'maratha-military-landscapes': [
    'The Marathas built forts not just on hills, but also on cliffs, islands, forests, and coastlines, turning nature into their greatest defence.',
  ],
};

export const TIMELESS_ICON_FACTS: Record<TimelessIconSlug, readonly string[]> = {
  'ajanta-caves': UNESCO_SITE_FACTS['ajanta-caves'],
  'ellora-caves': UNESCO_SITE_FACTS['ellora-caves'],
  'lonar-crater': [
    'Scientists from around the world study Lonar because its geology closely resembles the volcanic landscapes found on Mars.',
  ],
  'raigad-fort': [
    'The fort houses handprints and footprints traditionally believed to belong to Chhatrapati Shivaji Maharaj, preserved in stone.',
  ],
  'kas-plateau': [
    'Kaas is so ecologically fragile that visitor numbers are capped each day, helping protect one of India\'s richest seasonal flower ecosystems.',
  ],
  'daulatabad-fort': [
    'The fort\'s infamous Andheri (Dark Passage) was intentionally built with no natural light, confusing turns, and bats to disorient invading armies.',
    'One of India\'s earliest known toll booths operated here over 2,000 years ago, collecting taxes from traders crossing the Western Ghats.',
  ],
  'global-vipassana-pagoda': [
    'Ironically, the last British troops to leave independent India departed through the Gateway of India in 1948.',
  ],
};

export function getUnescoSiteFacts(slug: UnescoSiteSlug): readonly string[] {
  return UNESCO_SITE_FACTS[slug] ?? [];
}

export function getTimelessIconFacts(slug: TimelessIconSlug): readonly string[] {
  return TIMELESS_ICON_FACTS[slug] ?? [];
}

/** All quick facts for the UNESCO trail listing page (carousel). */
export function getUnescoTrailFacts(): readonly string[] {
  return Object.values(UNESCO_SITE_FACTS).flat();
}

/** All quick facts for the Timeless Icons trail listing page (carousel). */
export function getTimelessIconTrailFacts(): readonly string[] {
  return [...new Set(Object.values(TIMELESS_ICON_FACTS).flat())];
}
