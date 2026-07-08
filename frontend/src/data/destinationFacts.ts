import type { TimelessIconSlug } from '@/data/timelessIcons';
import type { UnescoSiteSlug } from '@/data/unescoSites';
import type { MonsoonTrailCategorySlug } from '@/data/monsoonTrailCategories';

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
    'The Global Vipassana Pagoda dome was built without supporting pillars — among the largest stone domes of its kind in the world.',
  ],
  'shaniwar-wada': [
    'Shaniwar Wada’s iconic Delhi Gate still frames Pune’s old city — the fort was the seat of the Peshwas before the great fire of 1828.',
  ],
  'sandhan-valley': [
    'Sandhan Valley is often called the “Valley of Shadows” — a narrow rappelling gorge in the Bhandardara backcountry that stays cool even in summer.',
  ],
  'gateway-of-india': [
    'Ironically, the last British troops to leave independent India departed through the Gateway of India in 1948.',
  ],
  'harihar-fort': [
    'Harihar Fort’s famous ladder-like rock steps rise at a near-vertical angle — one of the Sahyadri’s most photographed monsoon treks.',
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
  const hidden = new Set(['ajanta-caves', 'ellora-caves']);
  return [
    ...new Set(
      Object.entries(TIMELESS_ICON_FACTS)
        .filter(([slug]) => !hidden.has(slug))
        .flatMap(([, facts]) => facts),
    ),
  ];
}

const MONSOON_CATEGORY_FACTS: Record<MonsoonTrailCategorySlug, readonly string[]> = {
  'must-visit-waterfalls': [
    'Maharashtra receives over 2,500 mm of rain in parts of the Konkan — powering hundreds of seasonal waterfalls each monsoon.',
    'Devkund’s turquoise pool is fed by a multi-tier cascade deep in Tamhini forest.',
    'Thoseghar’s series of falls near Satara can be viewed from safe forest decks after short walks.',
  ],
  'scenic-monsoon-drives': [
    'Tamhini Ghat transforms into a waterfall corridor — dozens of roadside cascades appear only during active monsoon weeks.',
    'Malshej Ghat is famous for flamingoes in winter and rolling cloud banks in July and August.',
    'Amboli Ghat sits on the crest of the Western Ghats — one of India’s wettest inhabited passes.',
  ],
  'historic-forts-in-mist': [
    'Raigad was crowned capital of the Maratha swarajya in 1674 — its ramparts often float above monsoon cloud.',
    'Lohagad’s “Vinchu Kata” spur becomes a knife-edge ridge walk when the mist lifts between showers.',
    'Harishchandragad’s Konkan Kada cliff drops nearly vertically to the coastal plain — legendary among trekkers.',
  ],
  'walk-through-clouds': [
    'Mahabaleshwar’s plateaus can sit entirely inside monsoon cloud for hours — visibility changes every few minutes.',
    'Bhandardara’s Arthur Lake reflects monsoon sky when clouds part at dawn.',
    'Amboli’s misty meadows are a classic “walk in the clouds” experience on the Goa–Maharashtra divide.',
  ],
  'one-day-treks-near-mumbai': [
    'Rajmachi’s twin forts can be reached from Lonavala or Konkan villages — a favourite Mumbai monsoon day hike.',
    'Karnala’s thumb-shaped fort rises inside a bird sanctuary less than two hours from the city.',
    'Peb Fort (Vikatgad) rewards climbers with views over Matheran and the Ulhas valley.',
  ],
};

export function getMonsoonTrailFacts(): readonly string[] {
  return Object.values(MONSOON_CATEGORY_FACTS).flat();
}

export function getMonsoonCategoryFacts(slug: MonsoonTrailCategorySlug): readonly string[] {
  return MONSOON_CATEGORY_FACTS[slug] ?? [];
}
