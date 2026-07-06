import type { CategoryItinerary } from '@/components/krtiv/data';
import type { CuratedSpotlight } from '@/data/curatedSpotlights';
import type { DestinationRecord } from '@/data/destinations';
import { experienceItineraryDays } from '@/data/experienceItineraries';
import { MONSOON_TRAIL_EXTRA_META } from '@/data/monsoonTrailsExtraMeta';
import { getMonsoonHeroImageUrl, getMonsoonHeroSlides } from '@/data/monsoonHeroImages';
import { assetPath } from '@/lib/basePath';

export const MONSOON_TRAIL_SLUGS = [
  'thoseghar-waterfalls',
  'devkund-waterfall',
  'tamhini-ghat',
  'visapur-fort',
  'vajrai-waterfall',
  'randha-falls',
  'lingmala-waterfall',
  'malshej-ghat',
  'amboli-ghat',
  'varandha-ghat',
  'ambenali-ghat',
  'rajgad-fort',
  'raigad-fort',
  'pratapgad-fort',
  'lohagad-fort',
  'harishchandragad-fort',
  'mahabaleshwar',
  'bhandardara',
  'amboli',
  'rajmachi-fort',
  'korigad-fort',
  'karnala-fort',
  'peb-fort',
] as const;

export type MonsoonTrailSlug = (typeof MONSOON_TRAIL_SLUGS)[number];

export type MonsoonTrailRecord = Omit<DestinationRecord, 'slug'> & {
  slug: MonsoonTrailSlug;
  gallery: string[];
  experienceLabel: string;
  overview: string[];
  plannerPlaceSlug?: string;
};

export function monsoonTrailPath(slug: MonsoonTrailSlug) {
  return `/curated-itineraries/monsoon-trails/${slug}`;
}

function galleryFor(slug: MonsoonTrailSlug, staticHero?: string): string[] {
  const hero = `/curated/monsoon-trails/${slug}.jpg`;
  const base = `/curated/monsoon-trails/galleries/${slug}`;
  const extras: Partial<Record<MonsoonTrailSlug, string[]>> = {
    'thoseghar-waterfalls': [`${base}/1.jpg`, `${base}/2.jpg`, `${base}/3.jpg`, `${base}/4.jpg`, `${base}/5.jpg`],
    'devkund-waterfall': [`${base}/1.jpg`, `${base}/2.jpg`, `${base}/3.jpg`],
    'tamhini-ghat': [`${base}/1.jpg`, `${base}/2.jpg`, `${base}/3.jpg`, `${base}/4.jpg`, `${base}/5.jpg`],
    'visapur-fort': [`${base}/1.jpg`, `${base}/2.jpg`, `${base}/3.jpg`, `${base}/4.jpg`],
  };
  if (extras[slug]) return [hero, ...extras[slug]!];
  const fallback = staticHero ?? hero;
  return [fallback, fallback];
}

type Meta = {
  slug: MonsoonTrailSlug;
  title: string;
  subtitle: string;
  description: string;
  region: string;
  experienceLabel: string;
  lat: number;
  lng: number;
  zoom?: number;
  heroImage?: string;
  overview: string[];
  topAttractions: string[];
  bestTimeToVisit: string;
  localFood: string[];
  travelTips: string[];
  nearby: { label: string; href: string }[];
  plannerPlaceSlug?: string;
};

const META: Meta[] = [
  {
    slug: 'thoseghar-waterfalls',
    title: 'Thoseghar Waterfalls',
    subtitle: 'Maharashtra’s tallest monsoon cascade near Satara',
    description:
      'A horseshoe of seasonal waterfalls plunging into a forested gorge at the edge of the Konkan — Thoseghar is among the most dramatic monsoon spectacles in the Western Ghats, with a 200-metre main drop and a chain of smaller falls.',
    region: 'Satara district · Monsoon Trails',
    experienceLabel: 'Waterfall viewpoints',
    lat: 17.5966,
    lng: 73.8458,
    zoom: 12,
    overview: [
      'Thoseghar village sits where the Deccan plateau breaks toward the Konkan, and each monsoon the Waghora tributaries reinvent the landscape as a wall of white water. The main cataract — roughly 200 metres — is viewed from a forested platform built by the forest department; smaller segmented falls line the gorge in tiers of 15 to 20 metres. Mist, thunder, and the smell of wet basalt define the experience from July through September.',
      'The site is a favourite day trip from Pune and Satara. Corn vendors and tea stalls appear along the approach road in season; birders scan the canopy for drongos and hornbills between showers. Chalkewadi windmills on the ridge above add an unexpected modern contrast to ancient ghats scenery.',
      'Pair Thoseghar with Kaas Plateau’s wildflower bloom (September–October), Sajjangad fort above Satara, or a Mahabaleshwar hill-station extension. Paths become slippery in heavy rain — sturdy footwear and patience with weekend crowds are essential.',
    ],
    topAttractions: [
      'Main 200 m waterfall viewpoint platform',
      'Series of smaller tiered cascades',
      'Chalkewadi windmill ridge panorama',
      'Kaas Plateau wildflowers (post-monsoon)',
      'Sajjangad & Satara heritage loop',
    ],
    bestTimeToVisit:
      'July–September for peak monsoon volume; October for safer footing and Kaas Plateau pairing. Weekday mornings are quietest.',
    localFood: ['Roasted monsoon corn', 'Bhaji & chai at roadside stalls', 'Satara kandi pedhe', 'Vada pav on the Pune–Satara highway'],
    travelTips: [
      'Drive from Satara (~20 km) or Pune (~2.5 hrs) — parking at the designated lot near Chalkewadi road.',
      'Viewing platforms only; do not descend into the gorge during active monsoon — flash floods and slippery rock are real risks.',
      'Carry a rain jacket and grip footwear; mist will soak camera gear without protection.',
      'Combine with Kaas Plateau only in regulated bloom season — permits and entry slots apply.',
    ],
    nearby: [
      { label: 'Kaas Plateau', href: '/curated-itineraries/seven-wonders/kas-plateau' },
      { label: 'Mahabaleshwar', href: '/places-to-go/mahabaleshwar' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'mahabaleshwar',
  },
  {
    slug: 'devkund-waterfall',
    title: 'Devkund Waterfall',
    subtitle: 'Sacred plunge pool at the Kundalika’s origin',
    description:
      'Hidden in teak forest near Bhira village, Devkund — “the gods’ bathing pond” — is a free-fall waterfall pouring into one of Maharashtra’s clearest turquoise plunge pools, reached by a memorable 6.5 km forest trek.',
    region: 'Raigad district · Monsoon Trails',
    experienceLabel: 'Jungle trek',
    lat: 18.4775,
    lng: 73.4086,
    zoom: 12,
    overview: [
      'Devkund is a plunge waterfall: water drops straight off a basalt lip into a deep natural amphitheatre rather than sliding down rock. Three streams converge here; locals revere the pool as the origin of the Kundalika River, which later powers Kolad’s famous white-water rafting. The final pool glows jade-green when sunlight filters through monsoon cloud — one of the Sahyadri’s most photographed natural theatres.',
      'The trek from Bhira village (~6.5 km one way) follows dam backwaters, semi-evergreen forest, and stream crossings that swell dramatically in July and August. Forest department rules require a registered local guide; access is often restricted during peak flood days — always confirm status before travelling.',
      'Swimming is prohibited: the pool is deceptively deep with strong undercurrents and a history of accidents. Treat Devkund as a look-and-photograph destination. Strong trekking shoes, dry bags, and at least two litres of water per person are non-negotiable.',
    ],
    topAttractions: [
      'Devkund plunge pool & basalt amphitheatre',
      'Bhira dam backwaters en route',
      'Kundalika river origin mythology',
      'Tamhini Wildlife Sanctuary birdlife',
      'Kolad rafting extension (post-monsoon)',
    ],
    bestTimeToVisit:
      'September–November for the safest trek with full pools; July–August only when forest department permits access and water levels are stable.',
    localFood: ['Village thali in Bhira', 'Monsoon corn on the trail', 'Konkan fish thali near Kolad', 'Pune misal on the return drive'],
    travelTips: [
      'Mandatory guide registration at Bhira — budget ₹100–150 per person including forest entry.',
      'Nearest railhead: Mangaon (~30 km); from Mumbai ~170 km via Khopoli–Pali, from Pune ~110 km via Tamhini Ghat.',
      'Never enter the plunge pool — depth exceeds 15 m in sections with dangerous currents.',
      'Check live access updates in heavy monsoon; trails close without notice during cloudbursts.',
    ],
    nearby: [
      { label: 'Tamhini Ghat', href: '/curated-itineraries/monsoon-trails/tamhini-ghat' },
      { label: 'Lonavala', href: '/places-to-go/lonavala' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'lonavala',
  },
  {
    slug: 'tamhini-ghat',
    title: 'Tamhini Ghat',
    subtitle: 'Cloud forests & waterfall-lined highways',
    description:
      'The Tamhini pass links Pune’s Mulshi backwaters to the Konkan — in monsoon it becomes a cinematic corridor of mist, roadside cascades, and emerald valleys that defines Maharashtra’s great seasonal road trip.',
    region: 'Pune–Raigad corridor · Monsoon Trails',
    experienceLabel: 'Scenic drive',
    lat: 18.45,
    lng: 73.42,
    zoom: 11,
    overview: [
      'Tamhini Ghat is not a single viewpoint but a journey: the winding SH72 between Mulshi and Tamhini village unspools through dense Western Ghats forest, with waterfalls appearing beside the tarmac after every shower. Fog can reduce visibility to metres; when it lifts, the Plus valley reveals an amphitheatre of uninterrupted green.',
      'From Pune the classic route runs Pirangut → Paud → Mulshi dam → Tamhini (~55 km, 2 hours). Mumbai travellers often take the expressway to Lonavala, climb toward Paud, and descend through the ghat toward Kolad or Devkund. Bikers, photographers, and families chasing monsoon mood all share the road — start early on weekends.',
      'Stop only at safe pullouts; landslides and aquaplaning are real hazards in cloudbursts. Mulshi lake, Andharban forest trek, and Kolad rafting make natural companions for a two-day monsoon circuit.',
    ],
    topAttractions: [
      'Mulshi dam & backwater vistas',
      'Plus valley overlook',
      'Roadside monsoon waterfalls',
      'Andharban dark-forest trek',
      'Devkund & Kolad rafting loop',
    ],
    bestTimeToVisit:
      'June–September for full monsoon drama; avoid night driving in fog. October–February for cooler trekking with fewer falls.',
    localFood: ['Highway bhaji & corn stalls', 'Tea at monsoon pullouts', 'Konkan solkadhi further west', 'Pune misal before departure'],
    travelTips: [
      'From Pune: Pirangut–Paud–Mulshi–Tamhini; from Mumbai: Expressway → Lonavala → Paud → Mulshi.',
      'Check MHADA / district landslide alerts before departure during active monsoon systems.',
      'Fuel up in Mulshi — limited services inside the ghat. Carry snacks and a full windshield de-mister.',
      'Combine with Devkund trek or Kolad overnight for a complete Western Ghats weekend.',
    ],
    nearby: [
      { label: 'Devkund Waterfall', href: '/curated-itineraries/monsoon-trails/devkund-waterfall' },
      { label: 'Pune', href: '/places-to-go/pune' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'pune',
  },
  {
    slug: 'visapur-fort',
    title: 'Hike to Visapur Fort',
    subtitle: 'Monsoon waterfalls on Maratha ramparts',
    description:
      'Built by Peshwa Balaji Vishwanath between 1713 and 1720, Visapur sprawls across the same plateau as Lohagad near Lonavala — monsoon treks turn its stone walls into cascades and cloud-filled Sahyadri panoramas.',
    region: 'Lonavala · Monsoon Trails',
    experienceLabel: 'Fort trek',
    lat: 18.7225,
    lng: 73.49,
    zoom: 12,
    overview: [
      'Visapur Fort rises to 1,084 metres on a lush plateau above Malavli — five kilometres from the railway station that serves both Mumbai and Pune suburban lines. Unlike the more visited Lohagad, Visapur’s ruins are expansive and quieter: granaries, water cisterns, a Hanuman temple, and the famous Tatbandhi fortified wall reward explorers willing to walk further.',
      'Monsoon transforms the approach trails from Bhaje or Patan villages into streams — one popular route literally climbs through a waterfall on the fort walls between June and September. The plateau offers views of Lohagad, Tikona, Tung, and Pawna lake when clouds part; on misty days the experience is pure atmosphere.',
      'Allow three to four hours on the fort plus approach time. Strong hikers can pair Visapur with Lohagad in a long day; beginners should hire a local guide from Malavli and descend before fog thickens at dusk.',
    ],
    topAttractions: [
      'Tatbandhi fortified ramparts',
      'Monsoon waterfall-on-wall trail',
      'Hanuman temple & ancient caves',
      'Twin views of Lohagad & Pawna lake',
      'Bhaje Buddhist caves at the base',
    ],
    bestTimeToVisit:
      'June–September for mist, falls, and lush green; November–February for clear panoramas and easier footing.',
    localFood: ['Lonavala chikki & fudge', 'Corn pakoras at trail base', 'Highway misal at Malavli', 'Hot chai in monsoon'],
    travelTips: [
      'Nearest station: Malavli (5 km) on the Mumbai–Pune suburban line — shared autos to Bhaje/Patan base.',
      'Wear trekking shoes with grip; cotton clothes soak fast — carry a full rain cover and spare set in the car.',
      'The waterfall-on-wall section is seasonal and slippery — not suitable for children or monsoon beginners alone.',
      'No entry fee; ASI monument — carry out all litter from the plateau.',
    ],
    nearby: [
      { label: 'Lonavala', href: '/places-to-go/lonavala' },
      { label: 'Tamhini Ghat', href: '/curated-itineraries/monsoon-trails/tamhini-ghat' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'lonavala',
  },
];

const ALL_META: Meta[] = [...META, ...MONSOON_TRAIL_EXTRA_META];

function build(meta: Meta): MonsoonTrailRecord {
  const gallery = galleryFor(meta.slug, meta.heroImage);
  const hero = meta.heroImage
    ? assetPath(meta.heroImage)
    : getMonsoonHeroImageUrl(meta.slug, gallery[0]);
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
    nearbyDestinations: meta.nearby,
    days,
    gallery,
    experienceLabel: meta.experienceLabel,
    overview: meta.overview,
    plannerPlaceSlug: meta.plannerPlaceSlug,
  };
}

const BUILT = ALL_META.map(build);
const BY_SLUG = new Map(BUILT.map((s) => [s.slug, s]));

export function getMonsoonTrailSite(slug: string): MonsoonTrailRecord | undefined {
  return BY_SLUG.get(slug as MonsoonTrailSlug);
}

export function allMonsoonTrailSiteSlugs(): MonsoonTrailSlug[] {
  return [...MONSOON_TRAIL_SLUGS];
}

export function monsoonTrailAsItinerary(site: MonsoonTrailRecord): CategoryItinerary {
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

export function getMonsoonTrailSpotlights(): CuratedSpotlight[] {
  return BUILT.map((guide) => ({
    slug: guide.slug,
    title: guide.title,
    location: guide.subtitle,
    image: guide.hero,
    badge: `Monsoon · ${guide.experienceLabel}`,
    summary: guide.description,
    body: guide.overview.join(' '),
    highlights: guide.topAttractions.slice(0, 3),
    relatedHref: monsoonTrailPath(guide.slug),
    relatedLabel: `Explore ${guide.title}`,
  }));
}

export function getMonsoonHeroSlidesForSite(slug: MonsoonTrailSlug) {
  return getMonsoonHeroSlides(slug);
}
