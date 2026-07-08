import type { CategoryItinerary } from '@/components/krtiv/data';
import type { DestinationRecord } from '@/data/destinations';
import { unescoItineraryDays } from '@/data/unescoItineraries';
import { getUnescoHeroImageUrl } from '@/data/unescoHeroImages';

export const UNESCO_SITE_SLUGS = [
  'ajanta-caves',
  'ellora-caves',
  'elephanta-caves',
  'csmt',
  'western-ghats',
  'art-deco-mumbai',
  'maratha-military-landscapes',
] as const;

export type UnescoSiteSlug = (typeof UNESCO_SITE_SLUGS)[number];

export type UnescoSiteRecord = Omit<DestinationRecord, 'slug'> & {
  slug: UnescoSiteSlug;
  unescoYear: number;
  unescoCategory: 'Cultural' | 'Natural' | 'Mixed';
  gallery: string[];
  /** For smart-planner destination chips */
  plannerPlaceSlug?: string;
};

export function unescoSitePath(slug: UnescoSiteSlug) {
  return `/curated-itineraries/unesco/${slug}`;
}

function galleryFor(slug: UnescoSiteSlug): string[] {
  const hero = `/curated/unesco/${slug === 'art-deco-mumbai' ? 'art-deco-mumbai' : slug === 'csmt' ? 'csmt' : slug}.jpg`;
  return [
    hero,
    `/curated/unesco/galleries/${slug}/1.jpg`,
    `/curated/unesco/galleries/${slug}/2.jpg`,
    `/curated/unesco/galleries/${slug}/3.jpg`,
  ];
}

type Meta = {
  slug: UnescoSiteSlug;
  title: string;
  subtitle: string;
  description: string;
  region: string;
  unescoYear: number;
  unescoCategory: 'Cultural' | 'Natural' | 'Mixed';
  lat: number;
  lng: number;
  zoom?: number;
  topAttractions: string[];
  bestTimeToVisit: string;
  localFood: string[];
  travelTips: string[];
  nearby: { label: string; href: string }[];
  plannerPlaceSlug?: string;
};

const META: Meta[] = [
  {
    slug: 'ajanta-caves',
    title: 'Ajanta Caves',
    subtitle: 'Painted Buddhist monasteries in a Sahyadri cliff',
    description:
      'Thirty rock-cut caves above the Waghora gorge preserve nearly nine centuries of Buddhist art — narrative murals, sculpted Buddhas, and monastery architecture inscribed by UNESCO in 1983.',
    region: 'Chhatrapati Sambhajinagar · UNESCO 1983',
    unescoYear: 1983,
    unescoCategory: 'Cultural',
    lat: 20.5533,
    lng: 75.7003,
    zoom: 12,
    topAttractions: ['Cave 1 & 2 frescoes', 'Cave 16 & 17 paintings', 'Cave 26 dying Buddha', 'Waghora viewpoint'],
    bestTimeToVisit: 'October–March; closed Tuesdays. Arrive at opening for cooler light in the caves.',
    localFood: ['Naan qalia', 'Tahri', 'Mawa jalebi', 'Chhatrapati Sambhajinagar Himroo'],
    travelTips: [
      'Hire ASI-licensed guides at the ticket counter.',
      'Photography without flash; some caves restrict cameras.',
      'Base in Chhatrapati Sambhajinagar — ~2.5 hr drive each way.',
    ],
    nearby: [
      { label: 'Ellora Caves', href: unescoSitePath('ellora-caves') },
      { label: 'Ajanta & Ellora circuit', href: '/places-to-go/ajanta-ellora' },
    ],
    plannerPlaceSlug: 'ajanta-ellora',
  },
  {
    slug: 'ellora-caves',
    title: 'Ellora Caves',
    subtitle: 'Kailasa Temple and tri-faith rock architecture',
    description:
      'Thirty-four caves carved into a basalt escarpment embody Buddhist, Hindu, and Jain traditions — crowned by the monolithic Kailasa Temple, among the world’s greatest single-rock excavations.',
    region: 'Verul · UNESCO 1983',
    unescoYear: 1983,
    unescoCategory: 'Cultural',
    lat: 20.0264,
    lng: 75.1792,
    zoom: 12,
    topAttractions: ['Kailasa Temple (Cave 16)', 'Buddhist caves 1–12', 'Jain caves 30–34', 'Daulatabad day trip'],
    bestTimeToVisit: 'October–March; closed Tuesdays. Plan a full day for Kailasa alone.',
    localFood: ['Naan qalia', 'Biryani', 'Puran poli at highway dhabas'],
    travelTips: ['Wear sturdy shoes — uneven cave floors.', 'Sound-and-light shows run seasonally.', 'Combine with Grishneshwar Jyotirlinga nearby.'],
    nearby: [
      { label: 'Ajanta Caves', href: unescoSitePath('ajanta-caves') },
      { label: 'Ajanta & Ellora circuit', href: '/places-to-go/ajanta-ellora' },
    ],
    plannerPlaceSlug: 'ajanta-ellora',
  },
  {
    slug: 'elephanta-caves',
    title: 'Elephanta Caves',
    subtitle: 'Shaivite island temples in Mumbai Harbour',
    description:
      'On Gharapuri island, 5th–8th century sculptors carved volcanic rock into caverns devoted to Shiva — the colossal Trimurti remains one of India’s defining masterpieces.',
    region: 'Mumbai Harbour · UNESCO 1987',
    unescoYear: 1987,
    unescoCategory: 'Cultural',
    lat: 18.9633,
    lng: 72.9315,
    zoom: 13,
    topAttractions: ['Cave 1 Trimurti', 'Minor caves 2–5', 'Island cannon hill', 'Harbour ferry crossing'],
    bestTimeToVisit: 'November–February; ferries operate daily except monsoon rough-sea days.',
    localFood: ['Ferry snacks', 'Colaba cafés', 'Bhel puri at Gateway'],
    travelTips: ['Ferries from Gateway of India — buy return tickets.', 'Toy train uphill saves walking in heat.', 'Monkeys on island — secure food and bags.'],
    nearby: [
      { label: 'CSMT', href: unescoSitePath('csmt') },
      { label: 'Mumbai itineraries', href: '/places-to-go/mumbai' },
    ],
    plannerPlaceSlug: 'mumbai',
  },
  {
    slug: 'csmt',
    title: 'Chhatrapati Shivaji Maharaj Terminus',
    subtitle: 'Victorian Gothic Revival — Mumbai’s railway cathedral',
    description:
      'Completed in 1887, CSMT fuses European Gothic with Indian palace architecture. Still Maharashtra’s busiest station, it symbolises Bombay as the Gothic City of the British Raj.',
    region: 'Fort, Mumbai · UNESCO 2004',
    unescoYear: 2004,
    unescoCategory: 'Cultural',
    lat: 18.9402,
    lng: 72.8356,
    zoom: 15,
    topAttractions: ['Stone dome & turrets', 'Heritage museum (when open)', 'DN Road Gothic row', 'Night illumination'],
    bestTimeToVisit: 'Year-round; exterior best at dawn or blue hour. Avoid rush-hour crowds inside.',
    localFood: ['Irani cafés', 'Pav bhaji near CST', 'Fort street snacks'],
    travelTips: ['Active station — stay behind safety lines on platforms.', 'Heritage museum hours vary; check MTDC.', 'Pair with Oval Maidan walk.'],
    nearby: [
      { label: 'Art Deco Mumbai', href: unescoSitePath('art-deco-mumbai') },
      { label: 'Elephanta Caves', href: unescoSitePath('elephanta-caves') },
    ],
    plannerPlaceSlug: 'mumbai',
  },
  {
    slug: 'western-ghats',
    title: 'Western Ghats',
    subtitle: 'Sahyadri biodiversity — a global hotspot',
    description:
      'Maharashtra’s share of this UNESCO serial site protects ancient rainforests, endemic species, and monsoon-fed peaks that sustain the Konkan coast and Deccan plateau.',
    region: 'Sahyadri range · UNESCO 2012',
    unescoYear: 2012,
    unescoCategory: 'Natural',
    lat: 17.733,
    lng: 73.8389,
    zoom: 9,
    topAttractions: ['Kaas Plateau blooms', 'Kalsubai peak', 'Bhimashankar sanctuary', 'Matheran eco-zone'],
    bestTimeToVisit: 'Post-monsoon (Sep–Nov) for flowers; winter for treks; monsoon for mist & waterfalls with caution.',
    localFood: ['Kanda poha at trail stalls', 'Strawberries in Mahabaleshwar', 'Village thali in ghats towns'],
    travelTips: ['Book Kaas Plateau slots in bloom season.', 'Use local guides for summit treks.', 'Carry rain gear June–September.'],
    nearby: [
      { label: 'Lonavala', href: '/places-to-go/lonavala' },
      { label: 'Mahabaleshwar', href: '/places-to-go/mahabaleshwar' },
    ],
    plannerPlaceSlug: 'lonavala',
  },
  {
    slug: 'art-deco-mumbai',
    title: 'Victorian Gothic & Art Deco Ensembles',
    subtitle: 'Mumbai’s twin skylines around the Oval Maidan',
    description:
      'The 2018 inscription celebrates the world’s second-largest Art Deco district facing Victorian Gothic public buildings — an urban ensemble still lived in and loved.',
    region: 'Marine Drive & Fort · UNESCO 2018',
    unescoYear: 2018,
    unescoCategory: 'Cultural',
    lat: 18.9432,
    lng: 72.8236,
    zoom: 14,
    topAttractions: ['Marine Drive promenade', 'Oval Maidan views', 'Regal Cinema', 'Kala Ghoda galleries'],
    bestTimeToVisit: 'November–February for walking tours; monsoon for dramatic sea skies.',
    localFood: ['Leopold Café', 'Britannia & Co.', 'Chowpatty bhel puri'],
    travelTips: ['Join a guided Art Deco walk for hidden façades.', 'Look up above shop signage.', 'Respect residents in apartment buildings.'],
    nearby: [
      { label: 'CSMT', href: unescoSitePath('csmt') },
      { label: 'Mumbai itineraries', href: '/places-to-go/mumbai' },
    ],
    plannerPlaceSlug: 'mumbai',
  },
  {
    slug: 'maratha-military-landscapes',
    title: 'Maratha Military Landscapes',
    subtitle: 'Hill forts of the Maratha swarajya',
    description:
      'Inscribed in 2024, this serial site honours the strategic fort network of the Maratha empire — including Raigad, where Chhatrapati Shivaji Maharaj was crowned in 1674.',
    region: 'Raigad & Sahyadri forts · UNESCO 2024',
    unescoYear: 2024,
    unescoCategory: 'Cultural',
    lat: 18.235,
    lng: 73.44,
    zoom: 11,
    topAttractions: ['Raigad Fort', 'Rajgad trek', 'Shivneri birthplace fort', 'Sinhagad near Pune'],
    bestTimeToVisit: 'October–February for treks; post-monsoon for clear Konkan views from Raigad.',
    localFood: ['Pithla bhakri at fort stalls', 'Kanda bhaji at Sinhagad', 'Malvani thali in Mahad'],
    travelTips: ['Raigad ropeway saves a steep climb.', 'Start treks early; carry water.', 'Wear grippy footwear on fort rock.'],
    nearby: [
      { label: 'Historical circuits', href: '/category/historical' },
      { label: 'Pune', href: '/places-to-go/pune' },
    ],
    plannerPlaceSlug: 'pune',
  },
];

function build(meta: Meta): UnescoSiteRecord {
  const gallery = galleryFor(meta.slug);
  const hero = getUnescoHeroImageUrl(meta.slug, gallery[0]);
  const days = unescoItineraryDays(meta.slug, meta.title, gallery) ?? [];

  return {
    slug: meta.slug,
    title: meta.title,
    subtitle: meta.subtitle,
    description: meta.description,
    hero,
    accent: 'UNESCO',
    region: meta.region,
    map: { lat: meta.lat, lng: meta.lng, zoom: meta.zoom ?? 11 },
    topAttractions: meta.topAttractions,
    bestTimeToVisit: meta.bestTimeToVisit,
    localFood: meta.localFood,
    travelTips: meta.travelTips,
    nearbyDestinations: meta.nearby,
    days,
    unescoYear: meta.unescoYear,
    unescoCategory: meta.unescoCategory,
    gallery,
    plannerPlaceSlug: meta.plannerPlaceSlug,
  };
}

export const UNESCO_SITES: UnescoSiteRecord[] = META.map(build);

export function getUnescoSite(slug: string): UnescoSiteRecord | undefined {
  return UNESCO_SITES.find((s) => s.slug === slug);
}

export function allUnescoSiteSlugs(): UnescoSiteSlug[] {
  return [...UNESCO_SITE_SLUGS];
}

/** Minimal shape for itinerary components */
export function unescoSiteAsItinerary(site: UnescoSiteRecord): CategoryItinerary {
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
