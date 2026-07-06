import type { CuratedSpotlight } from '@/data/curatedSpotlights';
import type { MonsoonTrailSlug } from '@/data/monsoonTrails';
import { getMonsoonTrailSite, monsoonTrailPath } from '@/data/monsoonTrails';

export const MONSOON_TRAIL_CATEGORY_SLUGS = [
  'must-visit-waterfalls',
  'scenic-monsoon-drives',
  'historic-forts-in-mist',
  'walk-through-clouds',
  'one-day-treks-near-mumbai',
] as const;

export type MonsoonTrailCategorySlug = (typeof MONSOON_TRAIL_CATEGORY_SLUGS)[number];

export type MonsoonCategoryActivity = {
  trailSlug: MonsoonTrailSlug;
  title: string;
};

export type MonsoonTrailCategory = {
  slug: MonsoonTrailCategorySlug;
  title: string;
  description: string;
  activities: MonsoonCategoryActivity[];
};

export function monsoonCategoryPath(slug: MonsoonTrailCategorySlug) {
  return `/curated-itineraries/monsoon-trails/${slug}`;
}

export function isMonsoonCategorySlug(slug: string): slug is MonsoonTrailCategorySlug {
  return (MONSOON_TRAIL_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

const CATEGORIES: MonsoonTrailCategory[] = [
  {
    slug: 'must-visit-waterfalls',
    title: 'Must-Visit Waterfalls in Maharashtra This Monsoon',
    description:
      'From plunge pools hidden in teak forest to 200-metre cascades at the Konkan escarpment — Maharashtra’s monsoon waterfalls are at their most thunderous between July and September. Explore each guide with treks, viewpoints, and safety tips.',
    activities: [
      { trailSlug: 'devkund-waterfall', title: 'Devkund Waterfall' },
      { trailSlug: 'thoseghar-waterfalls', title: 'Thoseghar Waterfalls' },
      { trailSlug: 'vajrai-waterfall', title: 'Vajrai Waterfall' },
      { trailSlug: 'randha-falls', title: 'Randha Falls' },
      { trailSlug: 'lingmala-waterfall', title: 'Lingmala Waterfall' },
    ],
  },
  {
    slug: 'scenic-monsoon-drives',
    title: 'Most Scenic Monsoon Drives in Maharashtra',
    description:
      'Mist-wrapped ghats, roadside waterfalls, and cloud corridors through the Western Ghats — these monsoon drives are among Maharashtra’s great seasonal road trips. Start early, drive with care in fog, and stop only at safe pullouts.',
    activities: [
      { trailSlug: 'tamhini-ghat', title: 'Tamhini Ghat' },
      { trailSlug: 'malshej-ghat', title: 'Malshej Ghat' },
      { trailSlug: 'amboli-ghat', title: 'Amboli Ghat' },
      { trailSlug: 'varandha-ghat', title: 'Varandha Ghat' },
      { trailSlug: 'ambenali-ghat', title: 'Ambenali Ghat' },
    ],
  },
  {
    slug: 'historic-forts-in-mist',
    title: 'Historic Forts Wrapped in Mist',
    description:
      'Maratha ramparts, Sultanate gateways, and Sahyadri citadels emerge from monsoon cloud — these forts combine history with atmospheric treks when the ghats turn green and waterfalls run down stone walls.',
    activities: [
      { trailSlug: 'rajgad-fort', title: 'Rajgad Fort' },
      { trailSlug: 'raigad-fort', title: 'Raigad Fort' },
      { trailSlug: 'pratapgad-fort', title: 'Pratapgad Fort' },
      { trailSlug: 'lohagad-fort', title: 'Lohagad Fort' },
      { trailSlug: 'harishchandragad-fort', title: 'Harishchandragad Fort' },
    ],
  },
  {
    slug: 'walk-through-clouds',
    title: "Places Where You'll Walk Through the Clouds",
    description:
      'When the monsoon lifts warm air from the Konkan, entire plateaus and ghats disappear into rolling cloud — these destinations deliver the classic “walking in the sky” experience across Maharashtra’s Western Ghats.',
    activities: [
      { trailSlug: 'malshej-ghat', title: 'Malshej Ghat' },
      { trailSlug: 'tamhini-ghat', title: 'Tamhini Ghat' },
      { trailSlug: 'mahabaleshwar', title: 'Mahabaleshwar' },
      { trailSlug: 'bhandardara', title: 'Bhandardara' },
      { trailSlug: 'amboli', title: 'Amboli' },
    ],
  },
  {
    slug: 'one-day-treks-near-mumbai',
    title: 'One-Day Monsoon Treks Near Mumbai',
    description:
      'Forts, ridgelines, and forest trails within two hours of Mumbai — perfect single-day monsoon escapes with suburban rail links, village bases, and dramatic Sahyadri views when the clouds part.',
    activities: [
      { trailSlug: 'lohagad-fort', title: 'Lohagad Fort' },
      { trailSlug: 'rajmachi-fort', title: 'Rajmachi Fort' },
      { trailSlug: 'korigad-fort', title: 'Korigad Fort' },
      { trailSlug: 'karnala-fort', title: 'Karnala Fort' },
      { trailSlug: 'peb-fort', title: 'Peb Fort (Vikatgad)' },
    ],
  },
];

const BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getMonsoonTrailCategory(slug: string): MonsoonTrailCategory | undefined {
  return BY_SLUG.get(slug as MonsoonTrailCategorySlug);
}

export function allMonsoonCategorySlugs(): MonsoonTrailCategorySlug[] {
  return [...MONSOON_TRAIL_CATEGORY_SLUGS];
}

export function getMonsoonCategorySpotlights(): CuratedSpotlight[] {
  return CATEGORIES.map((category) => {
    const lead = category.activities[0];
    const site = lead ? getMonsoonTrailSite(lead.trailSlug) : undefined;
    return {
      slug: category.slug,
      title: category.title,
      location: `${category.activities.length} curated experiences`,
      image: site?.hero ?? '/curated/monsoon-trails/tamhini-ghat.jpg',
      badge: 'Monsoon Trails',
      summary: category.description.split('.')[0] + '.',
      body: category.description,
      highlights: category.activities.slice(0, 3).map((a) => a.title),
      relatedHref: monsoonCategoryPath(category.slug),
      relatedLabel: `Explore ${category.title}`,
      cardHref: monsoonCategoryPath(category.slug),
    };
  });
}

export function getMonsoonCategoryActivitySpotlights(
  categorySlug: MonsoonTrailCategorySlug,
): CuratedSpotlight[] {
  const category = getMonsoonTrailCategory(categorySlug);
  if (!category) return [];

  return category.activities.map((activity) => {
    const site = getMonsoonTrailSite(activity.trailSlug);
    if (!site) {
      return {
        slug: activity.trailSlug,
        title: activity.title,
        location: 'Monsoon Trails',
        image: '/curated/monsoon-trails/tamhini-ghat.jpg',
        badge: 'Monsoon',
        summary: activity.title,
        body: activity.title,
        highlights: [],
        relatedHref: monsoonTrailPath(activity.trailSlug),
        relatedLabel: `Explore ${activity.title}`,
      };
    }
    return {
      slug: activity.trailSlug,
      title: activity.title,
      location: site.subtitle,
      image: site.hero,
      badge: `Monsoon · ${site.experienceLabel}`,
      summary: site.description,
      body: site.overview.join(' '),
      highlights: site.topAttractions.slice(0, 3),
      relatedHref: monsoonTrailPath(activity.trailSlug),
      relatedLabel: `Explore ${activity.title}`,
    };
  });
}
