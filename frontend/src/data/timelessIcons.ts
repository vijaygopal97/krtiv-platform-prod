import type { CategoryItinerary } from '@/components/krtiv/data';
import type { CuratedSpotlight } from '@/data/curatedSpotlights';
import type { DestinationRecord } from '@/data/destinations';
import { timelessIconItineraryDays } from '@/data/timelessIconItineraries';
import { getTimelessIconHeroImageUrl } from '@/data/timelessIconHeroImages';

export const TIMELESS_ICON_SLUGS = [
  'ajanta-caves',
  'ellora-caves',
  'lonar-crater',
  'raigad-fort',
  'kas-plateau',
  'daulatabad-fort',
  'global-vipassana-pagoda',
] as const;

export type TimelessIconSlug = (typeof TIMELESS_ICON_SLUGS)[number];

export type TimelessIconRecord = Omit<DestinationRecord, 'slug'> & {
  slug: TimelessIconSlug;
  gallery: string[];
  iconYear: 2013;
  overview: string[];
  plannerPlaceSlug?: string;
};

export function timelessIconPath(slug: TimelessIconSlug) {
  return `/curated-itineraries/seven-wonders/${slug}`;
}

function heroImagePath(slug: TimelessIconSlug): string {
  if (slug === 'global-vipassana-pagoda') return '/curated/seven-wonders/global-pagoda.jpg';
  return `/curated/seven-wonders/${slug}.jpg`;
}

function galleryFor(slug: TimelessIconSlug): string[] {
  const hero = heroImagePath(slug);
  const base = `/curated/seven-wonders/galleries/${slug}`;
  return [hero, `${base}/1.jpg`, `${base}/2.jpg`, `${base}/3.jpg`];
}

type Meta = {
  slug: TimelessIconSlug;
  title: string;
  subtitle: string;
  description: string;
  region: string;
  lat: number;
  lng: number;
  zoom?: number;
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
    slug: 'ajanta-caves',
    title: 'Ajanta Caves',
    subtitle: 'Voted Timeless Icon · painted Buddhist monasteries',
    description:
      'Chosen in Maharashtra’s 2013 public vote, Ajanta’s thirty cliff-cut caves preserve nearly nine centuries of Buddhist mural art — among the greatest painting achievements of the ancient world.',
    region: 'Chhatrapati Sambhajinagar · Timeless Icon 2013',
    lat: 20.5533,
    lng: 75.7003,
    zoom: 12,
    overview: [
      'In 2013, MTDC and ABP Majha asked Maharashtra to choose its seven wonders — and Ajanta topped hearts as well as scholarly lists. Carved into a horseshoe ravine above the Waghora river, the caves span from the 2nd century BCE to about 650 CE, leaving narrative frescoes of Jataka tales, serene Buddhas, and monastery architecture that still glow in filtered light.',
      'Unlike a single monument, Ajanta is a walk through time: early Theravada cells give way to Mahayana halls with painted ceilings, culminating in Cave 26’s emotional dying Buddha sculpture. The Archaeological Museum at the base contextualises what you see in the caves — essential viewing before or after the climb.',
      'Ajanta is also a UNESCO World Heritage Site (1983). Allow a full day, hire an ASI-licensed guide, and base in Chhatrapati Sambhajinagar for the 2.5-hour drive each way. Closed Tuesdays.',
    ],
    topAttractions: ['Cave 1 & 2 Mahayana frescoes', 'Cave 16 & 17 narrative murals', 'Cave 26 dying Buddha', 'Waghora gorge viewpoint'],
    bestTimeToVisit: 'October–March; arrive at opening for cooler light and fewer coaches.',
    localFood: ['Naan qalia', 'Tahri', 'Mawa jalebi', 'Aurangabad Himroo textiles nearby'],
    travelTips: [
      'Hire licensed guides at the ticket counter — murals reward expert narration.',
      'No flash photography; some cells restrict cameras entirely.',
      'Pair with Ellora on a multi-day Deccan heritage loop.',
    ],
    nearby: [
      { label: 'Ellora Caves', href: timelessIconPath('ellora-caves') },
      { label: 'UNESCO Ajanta guide', href: '/curated-itineraries/unesco/ajanta-caves' },
      { label: 'All Timeless Icons', href: '/curated-itineraries/seven-wonders' },
    ],
    plannerPlaceSlug: 'ajanta-ellora',
  },
  {
    slug: 'ellora-caves',
    title: 'Ellora Caves',
    subtitle: 'Voted Timeless Icon · the monolithic Kailasa',
    description:
      'Ellora won its place among Maharashtra’s seven timeless icons for the Kailasa Temple alone — an entire multi-storey shrine hewn downward from living basalt, surrounded by Buddhist and Jain cave complexes.',
    region: 'Verul · Timeless Icon 2013',
    lat: 20.0264,
    lng: 75.1792,
    zoom: 12,
    overview: [
      'Where Ajanta whispers in Buddhist quiet, Ellora declares ambition in stone. The 2013 wonders vote celebrated this tri-faith escarpment — Buddhist caves 1–12, Brahmanical caves 13–29, and Jain caves 30–34 — as a symbol of religious coexistence carved across six centuries.',
      'Cave 16, the Kailasa Temple, is the showpiece: elephants, life-sized panels, and a courtyard chiselled from a single cliff face. Craftsmen worked top-down, removing an estimated 200,000 tonnes of rock. Dedicate an unhurried afternoon; even repeat visitors discover new sculptural details in shadowed niches.',
      'Ellora pairs naturally with Ajanta and Daulatabad Fort on the same trip. UNESCO-listed since 1983, the site closes Tuesdays. Evening sound-and-light shows run in season.',
    ],
    topAttractions: ['Kailasa Temple (Cave 16)', 'Buddhist chaitya halls', 'Jain Cave 32', 'Grishneshwar Jyotirlinga nearby'],
    bestTimeToVisit: 'October–March; plan a full day for Kailasa and the western Jain caves.',
    localFood: ['Deccan biryani', 'Naan qalia', 'Highway puran poli'],
    travelTips: [
      'Wear sturdy shoes — cave floors are uneven and sun-baked by afternoon.',
      'Grishneshwar temple is minutes away for pilgrims.',
      'Combine with Daulatabad Fort the same morning.',
    ],
    nearby: [
      { label: 'Ajanta Caves', href: timelessIconPath('ajanta-caves') },
      { label: 'Daulatabad Fort', href: timelessIconPath('daulatabad-fort') },
      { label: 'All Timeless Icons', href: '/curated-itineraries/seven-wonders' },
    ],
    plannerPlaceSlug: 'ajanta-ellora',
  },
  {
    slug: 'lonar-crater',
    title: 'Lonar Crater Lake',
    subtitle: 'Voted Timeless Icon · Earth’s basalt impact crater',
    description:
      'Lonar is the only hyper-velocity meteorite crater in basaltic rock on Earth — a saline emerald lake inside a rim of forest and temple ruins that feels otherworldly at dawn.',
    region: 'Buldhana district · Timeless Icon 2013',
    lat: 19.975,
    lng: 76.507,
    zoom: 12,
    overview: [
      'Roughly 50,000 years ago, a meteor struck the Deccan traps and left Lonar — a near-perfect circular bowl now filled with alkaline water studied by geologists and astrobiologists worldwide. Maharashtra’s 2013 vote recognised this rarity: nowhere else on the planet offers the same combination of impact geology and living Hindu temple heritage on the rim.',
      'Circumambulate the crater path at sunrise when mist lifts off the lake, visit the Daitya Sudan temple in Lonar town, and scan the shore for ancient sati stones and small shrines half-swallowed by forest. The water’s colour shifts from jade to steel grey with the sky.',
      'Lonar rewards an overnight stay far from city lights — stargazing from the rim is memorable. Base in Aurangabad (3 hours) or Buldhana for a dedicated geological pilgrimage.',
    ],
    topAttractions: ['Crater rim walking trail', 'Daitya Sudan temple', 'Kamalja Devi temple on shore', 'Impact geology interpretation centre'],
    bestTimeToVisit: 'October–February for cool treks; avoid peak summer heat on the rim.',
    localFood: ['Vidarbha thali', 'Simple village meals in Lonar town', 'Poha at highway stops'],
    travelTips: [
      'Wear trekking shoes — the rim path is rocky and uneven.',
      'Carry water; limited shops on the crater circuit.',
      'Respect temple dress codes on the shore shrines.',
    ],
    nearby: [
      { label: 'Ajanta Caves', href: timelessIconPath('ajanta-caves') },
      { label: 'All Timeless Icons', href: '/curated-itineraries/seven-wonders' },
    ],
    plannerPlaceSlug: 'ajanta-ellora',
  },
  {
    slug: 'raigad-fort',
    title: 'Raigad Fort',
    subtitle: 'Voted Timeless Icon · coronation seat of Shivaji Maharaj',
    description:
      'Raigad is where Chhatrapati Shivaji Maharaj was crowned and where the Maratha swarajya found its hill capital — cliff walls, royal ruins, and Konkan panoramas that define Maharashtra’s identity.',
    region: 'Raigad district · Timeless Icon 2013',
    lat: 18.235,
    lng: 73.44,
    zoom: 12,
    overview: [
      'When Maharashtra chose its seven wonders, Raigad needed no explanation: this is the fort where Shivaji Maharaj took the title of Chhatrapati in 1674. The queen’s chambers, granaries, marketplace ruins, and the throne platform (Rajyabhishek mandap) still command the Sahyadri crest above the Konkan.',
      'A ropeway lifts visitors from the base, or you can climb the Maha Darwaja steps for a pilgrim’s approach through mist and wind. On clear days the Arabian Sea glimmers westward; monsoon clouds turn the citadel into a floating island.',
      'Raigad is also part of the UNESCO Maratha Military Landscapes serial inscription (2024). Combine with Mahad, Pali, or a Konkan descent for a full heritage weekend.',
    ],
    topAttractions: ['Rajyabhishek throne platform', 'Maha Darwaja gateway', 'Queen’s chambers ruins', 'Ropeway & Takmak Tok cliff'],
    bestTimeToVisit: 'June–September for monsoon drama; November–February for clear Konkan views.',
    localFood: ['Kanda poha at base village', 'Konkan fish thali in Mahad', 'Pithla bhakri on highway'],
    travelTips: [
      'Ropeway tickets queue heavily on Shiv Jayanti and weekends — arrive early.',
      'Carry rain gear in monsoon; exposed ramparts are windy.',
      'Wear grip footwear if climbing instead of ropeway.',
    ],
    nearby: [
      { label: 'UNESCO Maratha Forts', href: '/curated-itineraries/unesco/maratha-military-landscapes' },
      { label: 'All Timeless Icons', href: '/curated-itineraries/seven-wonders' },
    ],
    plannerPlaceSlug: 'pune',
  },
  {
    slug: 'kas-plateau',
    title: 'Kaas Plateau',
    subtitle: 'Voted Timeless Icon · Maharashtra’s Valley of Flowers',
    description:
      'For a few weeks after the monsoon, Kaas erupts in endemic wildflowers found nowhere else on Earth — a biodiversity theatre that won its timeless icon status and UNESCO Western Ghats recognition.',
    region: 'Satara district · Timeless Icon 2013',
    lat: 17.72,
    lng: 73.98,
    zoom: 12,
    overview: [
      'Kaas Pathar — the Plateau of Flowers — sits at 1,200 metres where the Sahyadri escarpment meets the Konkan. When Maharashtra voted in 2013, this seasonal bloom was an obvious wonder: more than 850 flowering species, including Smithia hirsuta (the “touch-me-not” carpet), Utricularia bladderworts, and rare orchids paint the basalt in yellow, purple, and crimson.',
      'Access is regulated during peak bloom (typically September) to protect the fragile ecosystem. Boardwalks keep footsteps off the soil; entry slots and fees apply — book online before travelling. Outside bloom season the plateau is still a windswept grassland with valley views.',
      'Base in Satara or Mahabaleshwar and pair Kaas with Thoseghar waterfalls, Sajjangad fort, or a monsoon drive through the ghats. Part of the UNESCO Western Ghats serial site.',
    ],
    topAttractions: ['Seasonal wildflower carpets', 'Boardwalk biodiversity trail', 'Kaas lake nearby', 'Thoseghar waterfalls day trip'],
    bestTimeToVisit: 'September–early October for peak bloom; check official opening notifications yearly.',
    localFood: ['Satara kandi pedhe', 'Corn on the cob at plateau stalls', 'Strawberries in Mahabaleshwar'],
    travelTips: [
      'Book entry slots in advance during bloom weekends — capacity is capped.',
      'No picking flowers or stepping off boardwalks.',
      'Carry warm layers — plateau wind is cold even in sunshine.',
    ],
    nearby: [
      { label: 'Thoseghar Waterfalls', href: '/curated-itineraries/monsoon-trails/thoseghar-waterfalls' },
      { label: 'Mahabaleshwar', href: '/places-to-go/mahabaleshwar' },
      { label: 'All Timeless Icons', href: '/curated-itineraries/seven-wonders' },
    ],
    plannerPlaceSlug: 'mahabaleshwar',
  },
  {
    slug: 'daulatabad-fort',
    title: 'Daulatabad Fort',
    subtitle: 'Voted Timeless Icon · the unconquerable Deccan citadel',
    description:
      'Rising above the plains near Aurangabad, Daulatabad’s moats, tunnels, and hilltop stronghold earned its “unconquerable” reputation — and a place among Maharashtra’s seven timeless icons.',
    region: 'Daulatabad · Timeless Icon 2013',
    lat: 19.939,
    lng: 75.225,
    zoom: 13,
    overview: [
      'Devagiri — later Daulatabad — was the diamond of the Deccan sultanates before the Maratha era. The 2013 wonders vote celebrated its layered defences: triple moats, a rock-cut Andheri tunnel engineered to confuse invaders with echoes and darkness, and the soaring Chand Minar visible for kilometres across the plain.',
      'Climb through the pitch-dark zigzag passage with a pocket torch, emerge at successive gates, and survey the horizon from the summit where medieval trade routes once converged. The fort is 30 minutes from Ellora — easily half a day before or after the caves.',
      'ASI maintains the site; wear sturdy shoes and carry water. Afternoons on the upper ramparts are exposed — start early.',
    ],
    topAttractions: ['Andheri dark passage tunnel', 'Chand Minar minaret', 'Summit citadel views', 'Bharat Mata temple on peak'],
    bestTimeToVisit: 'October–March; avoid midday summer heat on the climb.',
    localFood: ['Aurangabad biryani', 'Naan qalia', 'Highway dhaba thali en route to Ellora'],
    travelTips: [
      'Torch essential for Andheri tunnel — available at entry vendors.',
      'Not recommended for claustrophobia or knee issues — steep steps throughout.',
      'Combine with Ellora caves same day — Daulatabad morning, Ellora afternoon.',
    ],
    nearby: [
      { label: 'Ellora Caves', href: timelessIconPath('ellora-caves') },
      { label: 'Ajanta Caves', href: timelessIconPath('ajanta-caves') },
      { label: 'All Timeless Icons', href: '/curated-itineraries/seven-wonders' },
    ],
    plannerPlaceSlug: 'ajanta-ellora',
  },
  {
    slug: 'global-vipassana-pagoda',
    title: 'Global Vipassana Pagoda',
    subtitle: 'Voted Timeless Icon · stone dome on the Arabian Sea',
    description:
      'Completed in 2009 and voted a timeless icon in 2013, the Global Vipassana Pagoda shelters the world’s largest stone dome built without supporting pillars — Burmese-inspired peace architecture on Gorai creek.',
    region: 'Northwest Mumbai · Timeless Icon 2013',
    lat: 19.228,
    lng: 72.805,
    zoom: 13,
    overview: [
      'The pagoda honours the spread of Vipassana meditation as taught by Sayagyi U Ba Khin. Its design echoes Yangon’s Shwedagon in simplified form: a monumental stone dome rising above Gorai’s mangrove edge, visible from ferry routes across the creek. Inside, the meditation hall seats thousands in silence beneath the unsupported stone canopy — an engineering feat as much as a spiritual one.',
      'Visitors explore museum galleries tracing the technique’s history in India, walk peaceful gardens, and view the dome from reflecting pools. The complex is non-denominational — dress modestly, remove shoes in sacred areas, and maintain silence in the hall.',
      'Reachable by ferry from Borivali’s Gorai jetty or by road via Mira–Bhayander — ideal as a contemplative half-day from Mumbai, paired with Gorai beach or EsselWorld nearby.',
    ],
    topAttractions: ['Main stone dome meditation hall', 'Vipassana museum galleries', 'Reflecting pool gardens', 'Gorai creek ferry crossing'],
    bestTimeToVisit: 'Year-round; morning hours are quietest. Check public visiting hours before travel.',
    localFood: ['Simple vegetarian canteen on site', 'Mumbai street food at Borivali', 'Coastal snacks at Gorai jetty'],
    travelTips: [
      'Modest dress required; photography restricted inside the meditation hall.',
      'Ferry timings vary with tide — confirm return boats at Gorai jetty.',
      'Allow 2–3 hours including museum and gardens.',
    ],
    nearby: [
      { label: 'Mumbai itineraries', href: '/places-to-go/mumbai' },
      { label: 'Elephanta Caves', href: '/curated-itineraries/unesco/elephanta-caves' },
      { label: 'All Timeless Icons', href: '/curated-itineraries/seven-wonders' },
    ],
    plannerPlaceSlug: 'mumbai',
  },
];

function build(meta: Meta): TimelessIconRecord {
  const gallery = galleryFor(meta.slug);
  const hero = getTimelessIconHeroImageUrl(meta.slug, gallery[0]);
  const days = timelessIconItineraryDays(meta.slug, meta.title, gallery) ?? [];
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
    iconYear: 2013,
    overview: meta.overview,
    plannerPlaceSlug: meta.plannerPlaceSlug,
  };
}

const BUILT = META.map(build);
const BY_SLUG = new Map(BUILT.map((s) => [s.slug, s]));

export function getTimelessIcon(slug: string): TimelessIconRecord | undefined {
  return BY_SLUG.get(slug as TimelessIconSlug);
}

export function allTimelessIconSlugs(): TimelessIconSlug[] {
  return [...TIMELESS_ICON_SLUGS];
}

export function timelessIconAsItinerary(site: TimelessIconRecord): CategoryItinerary {
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

export function getTimelessIconSpotlights(): CuratedSpotlight[] {
  return BUILT.map((site) => ({
    slug: site.slug,
    title: site.title,
    location: site.subtitle.replace(/^Voted Timeless Icon · /, ''),
    image: heroImagePath(site.slug),
    badge: 'Timeless Icon · 2013',
    summary: site.description,
    body: site.overview.join(' '),
    highlights: site.topAttractions.slice(0, 3),
    relatedHref: timelessIconPath(site.slug),
    relatedLabel: `Explore ${site.title}`,
  }));
}
