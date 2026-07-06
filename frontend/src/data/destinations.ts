import type { CategoryItinerary } from '@/components/krtiv/data';
import { assetPath } from '@/lib/basePath';
import { destinationPath, PLACES_NAV } from '@/lib/siteNavigation';
import { resolveDestinationSlug } from '@/lib/destinationRedirects';
import { approvedItineraryDays } from '@/data/placeApprovedItineraries';
import { placeHeroPosterPath } from '@/data/placeHeroPosters';
import { getDestinationHeroImageUrl } from '@/data/destinationHeroImages';

export type DestinationRecord = CategoryItinerary & {
  map: { lat: number; lng: number; zoom?: number };
  topAttractions: string[];
  bestTimeToVisit: string;
  localFood: string[];
  travelTips: string[];
  nearbyDestinations: { label: string; href: string }[];
};

type Meta = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  poster: string;
  lat: number;
  lng: number;
  zoom?: number;
  topAttractions: string[];
  bestTimeToVisit: string;
  localFood: string[];
  travelTips: string[];
  nearby: string[];
};

const META: Meta[] = [
  {
    slug: 'mumbai',
    title: 'Mumbai',
    subtitle: 'Maximum city — sea, cinema, and street life',
    description: 'Colonial façades, art deco lanes, bustling markets, and a coastline that never sleeps.',
    poster: '/places/heroes/mumbai.jpg',
    lat: 19.076, lng: 72.8777, zoom: 11,
    topAttractions: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'CST', 'Colaba'],
    bestTimeToVisit: 'November–February for clear skies and comfortable walks.',
    localFood: ['Vada Pav', 'Pav Bhaji', 'Bombay Sandwich', 'Solkadhi'],
    travelTips: ['Use local trains off-peak when possible.', 'Book ferry tickets early on weekends.'],
    nearby: ['alibaug', 'lonavala'],
  },
  {
    slug: 'pune',
    title: 'Pune',
    subtitle: 'Culture, campuses, and the gateway to the ghats',
    description: 'Maratha history, thoughtful cafés, and quick escapes to the Sahyadris.',
    poster: '/places/heroes/pune.jpg',
    lat: 18.5204, lng: 73.8567, zoom: 11,
    topAttractions: ['Shaniwar Wada', 'Aga Khan Palace', 'Sinhagad Fort', 'Koregaon Park'],
    bestTimeToVisit: 'October–March; monsoon for lush nearby hills.',
    localFood: ['Misal Pav', 'Puran Poli', 'Mastani'],
    travelTips: ['Leave early for hill-station day trips on weekends.'],
    nearby: ['lonavala', 'mahabaleshwar'],
  },
  {
    slug: 'nashik',
    title: 'Nashik',
    subtitle: 'Wine country and sacred ghats',
    description: 'Vineyards along the Godavari and pilgrimage paths through ancient temples.',
    poster: '/places/heroes/nashik.jpg',
    lat: 19.9975, lng: 73.7898,
    topAttractions: ['Trimbakeshwar', 'Sula Vineyards', 'Panchavati', 'Coin Museum'],
    bestTimeToVisit: 'Winter for vineyards; monsoon for green ghats.',
    localFood: ['Misal', 'Thalipeeth', 'Wine pairings'],
    travelTips: ['Arrange a designated driver for winery visits.'],
    nearby: ['shirdi'],
  },
  {
    slug: 'ajanta-ellora',
    title: 'Ajanta & Ellora',
    subtitle: 'UNESCO cave monuments near Chhatrapati Sambhajinagar',
    description:
      'Rock-cut Buddhist, Hindu and Jain masterpieces — plan base stays in Chhatrapati Sambhajinagar for cave day trips.',
    poster: '/places/heroes/ajanta-ellora.jpg',
    lat: 20.0264, lng: 75.1792, zoom: 11,
    topAttractions: ['Ajanta Caves', 'Ellora — Kailasa Temple', 'Bibi Ka Maqbara', 'Daulatabad Fort'],
    bestTimeToVisit: 'October–March; caves closed Tuesdays.',
    localFood: ['Naan Qalia', 'Tahri', 'Mawa jalebi'],
    travelTips: ['Start cave visits early; hire a licensed guide at Ajanta.'],
    nearby: ['nashik', 'shirdi'],
  },
  {
    slug: 'shirdi',
    title: 'Shirdi',
    subtitle: 'Pilgrimage town of Sai Baba',
    description: 'A serene centre of faith welcoming visitors year-round.',
    poster: '/places/heroes/shirdi.jpg',
    lat: 19.7645, lng: 74.477,
    topAttractions: ['Samadhi Mandir', 'Dwarkamai', 'Chavadi'],
    bestTimeToVisit: 'Year-round; expect queues on Thursdays.',
    localFood: ['Temple prasad', 'Simple vegetarian meals'],
    travelTips: ['Follow temple queue management and dress modestly.'],
    nearby: ['nashik'],
  },
  {
    slug: 'mahabaleshwar',
    title: 'Mahabaleshwar',
    subtitle: 'Strawberries, viewpoints, and cool plateaus',
    description: 'Colonial hill station overlooking the Krishna valley.',
    poster: '/places/heroes/mahabaleshwar.jpg',
    lat: 17.9239, lng: 73.6586,
    topAttractions: ["Arthur's Seat", 'Mapro Garden', 'Pratapgad', 'Venna Lake'],
    bestTimeToVisit: 'March–June and post-monsoon.',
    localFood: ['Strawberries with cream', 'Corn pakoras'],
    travelTips: ['Carry layers — evenings are cool.'],
    nearby: ['pune', 'lonavala'],
  },
  {
    slug: 'lonavala',
    title: 'Lonavala',
    subtitle: 'Mist, monsoon waterfalls, and hill-station escapes',
    description: 'A classic Western Ghats retreat between Mumbai and Pune.',
    poster: '/places/heroes/lonavala.jpg',
    lat: 18.7484, lng: 73.4065,
    topAttractions: ['Tiger Point', 'Bhushi Dam', 'Karla Caves', 'Lohagad'],
    bestTimeToVisit: 'Monsoon for waterfalls; winter for treks.',
    localFood: ['Chikki', 'Corn on the cob'],
    travelTips: ['Weekends are crowded — plan weekday visits when you can.'],
    nearby: ['mumbai', 'pune'],
  },
  {
    slug: 'alibaug',
    title: 'Alibaug',
    subtitle: 'Coastal forts and ferry weekends',
    description: 'Beaches and sea forts a short hop from Mumbai.',
    poster: '/places/heroes/alibaug.jpg',
    lat: 18.6414, lng: 72.8722,
    topAttractions: ['Kolaba Fort', 'Varsoli Beach', 'Murud day trips'],
    bestTimeToVisit: 'October–May.',
    localFood: ['Surmai fry', 'Solkadhi', 'Kokum sharbat'],
    travelTips: ['Check ferry and RoRo schedules from Mumbai.'],
    nearby: ['mumbai'],
  },
  {
    slug: 'kolhapur',
    title: 'Kolhapur',
    subtitle: 'Temples, wrestling tradition, and spicy cuisine',
    description: 'A cultural capital of southern Maharashtra.',
    poster: '/places/heroes/kolhapur.jpg',
    lat: 16.705, lng: 74.2433,
    topAttractions: ['Mahalaxmi Temple', 'New Palace Museum', 'Rankala Lake'],
    bestTimeToVisit: 'Winter months.',
    localFood: ['Kolhapuri misal', 'Pandhara rassa', 'Tambda rassa'],
    travelTips: ['Remove footwear at temple complexes.'],
    nearby: ['goa'],
  },
  {
    slug: 'nagpur',
    title: 'Nagpur',
    subtitle: 'Orange city and central India hub',
    description: 'Wide avenues, lakes, and access to tiger country.',
    poster: '/places/heroes/nagpur.jpg',
    lat: 21.1458, lng: 79.0882,
    topAttractions: ['Deekshabhoomi', 'Ambazari Lake', 'Sitabuldi Fort'],
    bestTimeToVisit: 'Winter months.',
    localFood: ['Saoji curry', 'Tarri poha', 'Santra barfi'],
    travelTips: ['Pair with Chandrapur for wildlife.'],
    nearby: ['chandrapur'],
  },
  {
    slug: 'sindhudurg',
    title: 'Sindhudurg',
    subtitle: 'Konkan coast, forts, and mangrove creeks',
    description: 'Quiet beaches and Malvani flavours along the southern Konkan.',
    poster: '/places/heroes/sindhudurg.jpg',
    lat: 16.17, lng: 73.56,
    topAttractions: ['Sindhudurg Fort', 'Tarkarli', 'Scuba at Malvan'],
    bestTimeToVisit: 'October–February.',
    localFood: ['Malvani fish curry', 'Kombdi vade', 'Solkadhi'],
    travelTips: ['Carry sun protection on boat rides.'],
    nearby: ['goa'],
  },
  {
    slug: 'chandrapur',
    title: 'Chandrapur',
    subtitle: 'Gateway to Tadoba tiger country',
    description: 'Teak forests and one of India\'s finest tiger reserves — plan safaris from Chandrapur.',
    poster: '/places/heroes/chandrapur.jpg',
    lat: 20.2858, lng: 79.4166, zoom: 10,
    topAttractions: ['Tadoba Andhari Tiger Reserve', 'Irai dam', 'Ancient Chandrapur Fort'],
    bestTimeToVisit: 'February–May for wildlife sightings.',
    localFood: ['Saoji curry', 'Resort meals near the reserve'],
    travelTips: ['Book safari slots well in advance.'],
    nearby: ['nagpur'],
  },
];

function build(meta: Meta): DestinationRecord {
  const posterPath = placeHeroPosterPath(meta.slug) ?? meta.poster;
  const hero = getDestinationHeroImageUrl(meta.slug) || assetPath(posterPath);
  const nearbyDestinations = meta.nearby
    .filter((s) => s !== 'goa' && META.some((m) => m.slug === resolveDestinationSlug(s)))
    .map((s) => {
      const resolved = resolveDestinationSlug(s);
      const m = META.find((x) => x.slug === resolved)!;
      return { label: m.title, href: destinationPath(resolved) };
    });

  const days =
    approvedItineraryDays(meta.slug, meta.title, hero) ??
    [];

  return {
    slug: meta.slug,
    title: meta.title,
    subtitle: meta.subtitle,
    description: meta.description,
    hero,
    accent: 'Discover',
    region: 'Maharashtra',
    map: { lat: meta.lat, lng: meta.lng, zoom: meta.zoom ?? 11 },
    topAttractions: meta.topAttractions,
    bestTimeToVisit: meta.bestTimeToVisit,
    localFood: meta.localFood,
    travelTips: meta.travelTips,
    nearbyDestinations,
    days,
  };
}

export const DESTINATIONS: DestinationRecord[] = META.map(build);

export function getDestination(slug: string) {
  const resolved = resolveDestinationSlug(slug);
  return DESTINATIONS.find((d) => d.slug === resolved);
}

/** Slugs for static generation — synced with PLACES_NAV. */
export function allDestinationSlugs() {
  return PLACES_NAV.map((p) => p.slug);
}
