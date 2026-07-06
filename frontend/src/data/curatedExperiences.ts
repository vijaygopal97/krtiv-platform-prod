import type { CategoryItinerary } from '@/components/krtiv/data';
import type { CuratedSpotlight } from '@/data/curatedSpotlights';
import type { DestinationRecord } from '@/data/destinations';
import { PLACE_IMAGES } from '@/data/placeImageLibrary';
import { experienceItineraryDays } from '@/data/experienceItineraries';

export type CuratedExperienceTrail = 'nature-trails' | 'monsoon-trails';

export const NATURE_TRAIL_SLUGS = [
  'tadoba-tiger-reserve',
  'bhandardara-fireflies',
  'flamingo-watching',
  'navegaon-national-park',
  'karnala-bird-sanctuary',
  'thoseghar-waterfalls',
] as const;

export const MONSOON_TRAIL_SLUGS = [
  'thoseghar-waterfalls',
  'devkund-waterfall',
  'tamhini-ghat',
  'visapur-fort',
] as const;

export type NatureTrailSlug = (typeof NATURE_TRAIL_SLUGS)[number];
export type MonsoonTrailSlug = (typeof MONSOON_TRAIL_SLUGS)[number];
export type ExperienceSlug = NatureTrailSlug | MonsoonTrailSlug;

type ExperienceMeta = {
  slug: ExperienceSlug;
  title: string;
  subtitle: string;
  description: string;
  region: string;
  experienceLabel: string;
  lat: number;
  lng: number;
  zoom?: number;
  gallery: string[];
  topAttractions: string[];
  bestTimeToVisit: string;
  localFood: string[];
  travelTips: string[];
  plannerPlaceSlug?: string;
};

const EXPERIENCES: Record<ExperienceSlug, ExperienceMeta> = {
  'tadoba-tiger-reserve': {
    slug: 'tadoba-tiger-reserve',
    title: 'Tadoba Tiger Reserve',
    subtitle: 'Tiger country in teak forests',
    description:
      'Maharashtra’s premier tiger reserve — morning and evening jeep safaris through bamboo groves and meadows where Bengal tigers, leopards, and sloth bears roam.',
    region: 'Chandrapur · Nature Trails',
    experienceLabel: 'Wildlife safari',
    lat: 20.245,
    lng: 79.425,
    zoom: 10,
    gallery: [
      '/curated/nature-trails/tadoba-tiger-reserve.jpg',
      PLACE_IMAGES.tadobaTiger,
      PLACE_IMAGES.tadobaSafari,
      PLACE_IMAGES.lonavalaHills,
    ],
    topAttractions: ['Jeep safari zones', 'Irai reservoir', 'Tiger tracking', 'Birding trails'],
    bestTimeToVisit: 'February–May for tiger sightings; November–February for pleasant weather.',
    localFood: ['Saoji curry', 'Forest lodge meals', 'Nagpur tarri poha'],
    travelTips: ['Book safari slots 60–90 days ahead online.', 'Carry neutral-coloured clothing.', 'Stay inside Chandrapur or forest lodges.'],
    plannerPlaceSlug: 'chandrapur',
  },
  'bhandardara-fireflies': {
    slug: 'bhandardara-fireflies',
    title: 'Bhandardara Fireflies Festival',
    subtitle: 'Monsoon meadows lit by bioluminescence',
    description:
      'Each pre-monsoon, the forests around Bhandardara and Purushwadi glow with millions of fireflies — a natural light show best experienced on guided night walks.',
    region: 'Ahmednagar · Nature Trails',
    experienceLabel: 'Night forest walk',
    lat: 19.536,
    lng: 73.751,
    gallery: [
      '/curated/nature-trails/bhandardara-fireflies.jpg',
      PLACE_IMAGES.bhandardaraLake,
      PLACE_IMAGES.kalsubaiSunrise,
      PLACE_IMAGES.kalsubaiPeak,
    ],
    topAttractions: ['Firefly trails', 'Arthur Lake', 'Randha Falls', 'Kalsubai base treks'],
    bestTimeToVisit: 'Late May–June before heavy monsoon rains.',
    localFood: ['Village thali', 'Pithla bhakri', 'Local honey'],
    travelTips: ['No flash photography on firefly walks.', 'Book homestays early — limited capacity.', 'Wear closed shoes and carry a torch.'],
    plannerPlaceSlug: 'lonavala',
  },
  'flamingo-watching': {
    slug: 'flamingo-watching',
    title: 'Flamingo Watching',
    subtitle: 'Migratory pink flocks along the mudflats',
    description:
      'Winter brings thousands of greater and lesser flamingos to Mumbai’s Thane Creek and coastal wetlands — one of India’s most accessible urban wildlife spectacles.',
    region: 'Mumbai–Thane wetlands · Nature Trails',
    experienceLabel: 'Birding & wetlands',
    lat: 19.05,
    lng: 72.95,
    zoom: 11,
    gallery: [
      '/curated/nature-trails/flamingo-watching.jpg',
      PLACE_IMAGES.mumbaiGateway,
      PLACE_IMAGES.mumbaiMarineDrive,
      PLACE_IMAGES.konkanKashid,
    ],
    topAttractions: ['Thane Creek Flamingo Sanctuary', 'Airoli–Diva mudflats', 'BNHS guided walks', 'Seewri jetty'],
    bestTimeToVisit: 'November–March when migratory flamingos are present.',
    localFood: ['Coastal seafood', 'Bombay street snacks', 'Solkadhi'],
    travelTips: ['Join BNHS or MTDC guided tours for best access.', 'Carry binoculars.', 'Check tide timings for mudflat viewing.'],
    plannerPlaceSlug: 'mumbai',
  },
  'navegaon-national-park': {
    slug: 'navegaon-national-park',
    title: 'Navegaon National Park',
    subtitle: 'Central India’s lake-and-forest sanctuary',
    description:
      'A compact national park around Navegaon Bandh lake — boat rides, watchtowers, and forest trails where tigers, leopards, and diverse birdlife thrive in teak country.',
    region: 'Gondia · Nature Trails',
    experienceLabel: 'Forest & lake',
    lat: 21.175,
    lng: 80.014,
    zoom: 11,
    gallery: [
      '/curated/nature-trails/navegaon-national-park.jpg',
      PLACE_IMAGES.tadobaTiger,
      PLACE_IMAGES.tadobaSafari,
      PLACE_IMAGES.lonavalaHills,
    ],
    topAttractions: ['Navegaon lake', 'Watchtower views', 'Deer park', 'Jungle trails'],
    bestTimeToVisit: 'October–March; summer for tiger luck near water.',
    localFood: ['Vidarbha village meals', 'Saoji spice', 'Resort thali'],
    travelTips: ['Combine with Nagpur as a base city.', 'Book forest rest house in advance.', 'Carry insect repellent.'],
    plannerPlaceSlug: 'nagpur',
  },
  'karnala-bird-sanctuary': {
    slug: 'karnala-bird-sanctuary',
    title: 'Karnala Bird Sanctuary',
    subtitle: 'Rainforest ridge an hour from Mumbai',
    description:
      'A pocket of evergreen forest beneath the Karnala fort pinnacle — home to racket-tailed drongos, hornbills, and 150+ resident and migratory bird species on easy day trails.',
    region: 'Raigad · Nature Trails',
    experienceLabel: 'Bird sanctuary',
    lat: 18.887,
    lng: 73.125,
    zoom: 12,
    gallery: [
      '/curated/nature-trails/karnala-bird-sanctuary.jpg',
      PLACE_IMAGES.karnala,
      PLACE_IMAGES.sinhagad,
      PLACE_IMAGES.lonavalaHills,
    ],
    topAttractions: ['Karnala fort trek', 'Forest birding trails', 'Butterfly season', 'Panoramic ridge views'],
    bestTimeToVisit: 'November–February for migrants; monsoon for lush forest.',
    localFood: ['Highway dhaba meals', 'Lonavala chikki stops', 'Vada pav en route'],
    travelTips: ['Start early for bird activity.', 'Wear trekking shoes if climbing to the fort.', 'No plastic inside the sanctuary.'],
    plannerPlaceSlug: 'mumbai',
  },
  'thoseghar-waterfalls': {
    slug: 'thoseghar-waterfalls',
    title: 'Thoseghar Waterfalls',
    subtitle: 'Monsoon cascades in the Satara ghats',
    description:
      'A series of seasonal waterfalls plunging into a forested gorge near Satara — Maharashtra’s most photographed monsoon cascade, with viewpoints and misty walks.',
    region: 'Satara · Nature & Monsoon Trails',
    experienceLabel: 'Waterfall viewpoints',
    lat: 17.625,
    lng: 73.842,
    zoom: 12,
    gallery: [
      '/curated/nature-trails/thoseghar-waterfalls.jpg',
      PLACE_IMAGES.lonavalaHills,
      '/places/slides/lonavala/bhaje-caves.jpg',
      PLACE_IMAGES.mahabaleshwarHills,
    ],
    topAttractions: ['Main waterfall viewpoint', 'Series of smaller falls', 'Chalkewadi windmills nearby', 'Kaas Plateau day trip'],
    bestTimeToVisit: 'July–September peak monsoon flow; post-monsoon for safer paths.',
    localFood: ['Corn on the cob', 'Bhaji stalls', 'Satara kandi pedhe'],
    travelTips: ['Paths can be slippery — wear grip footwear.', 'Avoid swimming in plunge pools during heavy rain.', 'Combine with Kaas or Sajjangad.'],
    plannerPlaceSlug: 'mahabaleshwar',
  },
  'devkund-waterfall': {
    slug: 'devkund-waterfall',
    title: 'Devkund Waterfall',
    subtitle: 'Forest pool at the origin of the Kundalika',
    description:
      'A sacred plunge-pool waterfall reached through a moderate jungle trek near Bhira village — turquoise water, basalt cliffs, and raw Sahyadri monsoon drama.',
    region: 'Raigad · Monsoon Trails',
    experienceLabel: 'Jungle trek',
    lat: 18.352,
    lng: 73.422,
    zoom: 12,
    gallery: [
      '/curated/monsoon-trails/devkund-waterfall.jpg',
      PLACE_IMAGES.lonavalaHills,
      '/places/slides/lonavala/karla-caves.jpg',
      PLACE_IMAGES.sinhagad,
    ],
    topAttractions: ['Devkund plunge pool', 'Forest trek', 'Kundalika origin', 'Bhira village base'],
    bestTimeToVisit: 'July–September; trek may be restricted in peak flood days.',
    localFood: ['Village lunch in Bhira', 'Monsoon corn', 'Pune misal on return'],
    travelTips: ['Hire a local guide — trail crosses streams.', 'Forest department rules apply; check access.', 'Do not litter near the sacred pool.'],
    plannerPlaceSlug: 'lonavala',
  },
  'tamhini-ghat': {
    slug: 'tamhini-ghat',
    title: 'Scenic Drives through Tamhini Ghat',
    subtitle: 'Cloud forests and waterfall-lined highways',
    description:
      'The Tamhini mountain pass between Pune and the Konkan unfolds in monsoon as a corridor of mist, countless roadside falls, and emerald valleys — one of Maharashtra’s great scenic drives.',
    region: 'Pune–Konkan corridor · Monsoon Trails',
    experienceLabel: 'Scenic drive',
    lat: 18.45,
    lng: 73.42,
    zoom: 11,
    gallery: [
      '/curated/monsoon-trails/tamhini-ghat.jpg',
      PLACE_IMAGES.lonavalaHills,
      '/places/slides/lonavala/matheran.jpg',
      PLACE_IMAGES.konkanKashid,
    ],
    topAttractions: ['Tamhini viewpoint', 'Roadside waterfalls', 'Mulshi backwaters', 'Plus valley vistas'],
    bestTimeToVisit: 'June–September for full monsoon drama; drive with caution.',
    localFood: ['Highway bhaji stalls', 'Corn & tea stops', 'Konkan solkadhi further west'],
    travelTips: ['Avoid night driving in heavy rain.', 'Check landslide alerts during cloudbursts.', 'Start from Pune early to beat weekend traffic.'],
    plannerPlaceSlug: 'pune',
  },
  'visapur-fort': {
    slug: 'visapur-fort',
    title: 'Hike to Visapur Fort',
    subtitle: 'Monsoon mist on a twin of Lohagad',
    description:
      'A sprawling hill fort linked to Lohagad near Lonavala — monsoon hikes reveal water cascades on ancient ramparts, Hanuman carvings, and cloud-filled Sahyadri views.',
    region: 'Lonavala · Monsoon Trails',
    experienceLabel: 'Fort trek',
    lat: 18.718,
    lng: 73.485,
    zoom: 12,
    gallery: [
      '/curated/monsoon-trails/visapur-fort.jpg',
      PLACE_IMAGES.sinhagad,
      PLACE_IMAGES.raigadFort,
      PLACE_IMAGES.lonavalaHills,
    ],
    topAttractions: ['Fort ramparts', 'Monsoon waterfalls on walls', 'Lohagad twin views', 'Bhaje caves nearby'],
    bestTimeToVisit: 'June–September for mist and falls; winter for clear panoramas.',
    localFood: ['Lonavala chikki', 'Corn pakoras', 'Highway misal'],
    travelTips: ['Muddy trails in rain — trekking shoes essential.', 'Combine with Lohagad on a long day.', 'Carry rain cover and spare clothes.'],
    plannerPlaceSlug: 'lonavala',
  },
};

export type CuratedExperienceRecord = Omit<DestinationRecord, 'slug'> & {
  slug: ExperienceSlug;
  gallery: string[];
  experienceLabel: string;
  plannerPlaceSlug?: string;
};

function buildGuide(meta: ExperienceMeta, trail?: CuratedExperienceTrail): CuratedExperienceRecord {
  let gallery = meta.gallery.filter(Boolean);
  if (trail === 'monsoon-trails' && meta.slug === 'thoseghar-waterfalls') {
    gallery = gallery.map((src) => src.replace('/nature-trails/', '/monsoon-trails/'));
  }
  const hero = gallery[0];
  const days = experienceItineraryDays(meta.slug, meta.title, gallery) ?? [];
  return {
    slug: meta.slug,
    title: meta.title,
    subtitle: meta.subtitle,
    description: meta.description,
    hero,
    accent: 'Discover',
    region: meta.region,
    map: { lat: meta.lat, lng: meta.lng, zoom: meta.zoom ?? 11 },
    topAttractions: meta.topAttractions,
    bestTimeToVisit: meta.bestTimeToVisit,
    localFood: meta.localFood,
    travelTips: meta.travelTips,
    nearbyDestinations: [],
    days,
    gallery,
    experienceLabel: meta.experienceLabel,
    plannerPlaceSlug: meta.plannerPlaceSlug,
  };
}

export function curatedExperiencePath(trail: CuratedExperienceTrail, slug: ExperienceSlug) {
  return `/curated-itineraries/${trail}/${slug}`;
}

export function getNatureTrail(slug: string): CuratedExperienceRecord | undefined {
  if (!NATURE_TRAIL_SLUGS.includes(slug as NatureTrailSlug)) return undefined;
  const meta = EXPERIENCES[slug as ExperienceSlug];
  return meta ? buildGuide(meta, 'nature-trails') : undefined;
}

export function getMonsoonTrail(slug: string): CuratedExperienceRecord | undefined {
  if (!MONSOON_TRAIL_SLUGS.includes(slug as MonsoonTrailSlug)) return undefined;
  const meta = EXPERIENCES[slug as ExperienceSlug];
  return meta ? buildGuide(meta, 'monsoon-trails') : undefined;
}

export function allNatureTrailSlugs(): NatureTrailSlug[] {
  return [...NATURE_TRAIL_SLUGS];
}

export function allMonsoonTrailSlugs(): MonsoonTrailSlug[] {
  return [...MONSOON_TRAIL_SLUGS];
}

export function experienceAsItinerary(site: CuratedExperienceRecord): CategoryItinerary {
  return {
    slug: site.slug,
    title: site.title,
    subtitle: site.subtitle,
    description: site.description,
    hero: site.hero,
    accent: site.accent,
    region: site.region,
    days: site.days,
  };
}

function spotlightFromGuide(guide: CuratedExperienceRecord, trail: CuratedExperienceTrail): CuratedSpotlight {
  return {
    slug: guide.slug,
    title: guide.title,
    location: guide.subtitle,
    image: guide.hero,
    badge: trail === 'nature-trails' ? `Nature · ${guide.experienceLabel}` : `Monsoon · ${guide.experienceLabel}`,
    summary: guide.description,
    body: guide.description,
    highlights: guide.topAttractions.slice(0, 3),
    relatedHref: curatedExperiencePath(trail, guide.slug),
    relatedLabel: `Explore ${guide.title}`,
  };
}

export function getNatureTrailSpotlights(): CuratedSpotlight[] {
  return NATURE_TRAIL_SLUGS.map((slug) => spotlightFromGuide(getNatureTrail(slug)!, 'nature-trails'));
}

export function getMonsoonTrailSpotlights(): CuratedSpotlight[] {
  return MONSOON_TRAIL_SLUGS.map((slug) => spotlightFromGuide(getMonsoonTrail(slug)!, 'monsoon-trails'));
}
