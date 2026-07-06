import { PLACE_IMAGES } from '@/data/placeImageLibrary';
import type { MonsoonTrailSlug } from '@/data/monsoonTrails';

type ExtraMeta = {
  slug: MonsoonTrailSlug;
  title: string;
  subtitle: string;
  description: string;
  region: string;
  experienceLabel: string;
  heroImage: string;
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

function meta(p: ExtraMeta): ExtraMeta {
  return p;
}

/** Additional monsoon trail guides referenced from category listings. */
export const MONSOON_TRAIL_EXTRA_META: ExtraMeta[] = [
  meta({
    slug: 'vajrai-waterfall',
    title: 'Vajrai Waterfall',
    subtitle: 'Satara district · 260 m cascade near Kaas',
    description:
      'Among Maharashtra’s tallest seasonal waterfalls, Vajrai plunges in three tiers near Bhambavli village — a monsoon spectacle above the Kaas Plateau when the Urmodi river runs full.',
    region: 'Satara district · Monsoon Trails',
    experienceLabel: 'Waterfall viewpoints',
    heroImage: PLACE_IMAGES.mahabaleshwarHills,
    lat: 17.885,
    lng: 73.865,
    overview: [
      'Vajrai is best known for its sheer height — roughly 260 metres in the monsoon — and for the short forest walk from Bhambavli village to viewing points above the gorge. Mist, thunder, and emerald valleys define the experience from July through September.',
      'Pair Vajrai with Kaas Plateau (in regulated bloom season), Thoseghar, or a Mahabaleshwar hill-station loop. Paths become slippery in heavy rain — grip footwear and patience with weekend crowds are essential.',
    ],
    topAttractions: ['Main three-tier cascade viewpoint', 'Bhambavli village approach', 'Kaas Plateau pairing', 'Thoseghar day circuit'],
    bestTimeToVisit: 'July–September for peak volume; avoid the gorge edge during active cloudbursts.',
    localFood: ['Roasted monsoon corn', 'Satara kandi pedhe', 'Highway chai near Satara'],
    travelTips: ['Base in Satara or Mahabaleshwar; confirm local access rules each season.', 'Do not enter the gorge during flash-flood alerts.', 'Carry rain gear and dry bags for electronics.'],
    nearby: [
      { label: 'Thoseghar Waterfalls', href: '/curated-itineraries/monsoon-trails/thoseghar-waterfalls' },
      { label: 'Kaas Plateau', href: '/curated-itineraries/seven-wonders/kas-plateau' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'mahabaleshwar',
  }),
  meta({
    slug: 'randha-falls',
    title: 'Randha Falls',
    subtitle: 'Bhandardara · Rajur gorge plunge',
    description:
      'Where the Pravara River drops into a rocky gorge below Arthur Lake, Randha Falls is one of the Sahyadri’s signature monsoon cataracts — best viewed from the dedicated platform when the dam releases water.',
    region: 'Ahilyanagar district · Monsoon Trails',
    experienceLabel: 'Waterfall viewpoints',
    heroImage: PLACE_IMAGES.bhandardaraLake,
    lat: 19.537,
    lng: 73.755,
    overview: [
      'Randha Falls sits in the Bhandardara resort belt above Wilson Dam. In full monsoon the river thunders into the gorge; mist rises hundreds of feet and rainbows appear on clear afternoons after showers.',
      'Combine Randha with Arthur Lake, Amruteshwar temple, and firefly trails in pre-monsoon weeks — or with Kalsubai base treks for a complete Western Ghats weekend.',
    ],
    topAttractions: ['Randha Falls viewing platform', 'Wilson Dam & Arthur Lake', 'Amruteshwar temple', 'Kalsubai trek extension'],
    bestTimeToVisit: 'July–September when dam outflow feeds the falls; weekdays are quieter.',
    localFood: ['Village thali near Bhandardara', 'Hot chai at viewpoints', 'Highway vada pav from Igatpuri'],
    travelTips: ['Stay on marked platforms — gorge edges are unstable in rain.', 'Check dam release schedules with local resorts.', 'Road from Igatpuri can fog heavily — drive by day.'],
    nearby: [
      { label: 'Bhandardara', href: '/curated-itineraries/monsoon-trails/bhandardara' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'lonavala',
  }),
  meta({
    slug: 'lingmala-waterfall',
    title: 'Lingmala Waterfall',
    subtitle: 'Mahabaleshwar · Dhobi waterfall companion',
    description:
      'A short drive from Mahabaleshwar town, Lingmala sends a seasonal stream over a cliff into the Venna valley — one of the hill station’s easiest monsoon waterfall stops with forested viewpoints.',
    region: 'Satara district · Monsoon Trails',
    experienceLabel: 'Waterfall viewpoints',
    heroImage: PLACE_IMAGES.mahabaleshwarHills,
    lat: 17.912,
    lng: 73.655,
    overview: [
      'Lingmala is a classic Mahabaleshwar monsoon detour: park near the forest check post, walk to the main viewing deck, and watch the valley fill with cloud when the stream is in spate. Dhobi Waterfall nearby offers a second, busier cascade experience.',
      'Ideal as an afternoon add-on to Arthur’s Seat, Mapro Garden, or a full Venna Lake day — allow an hour including photography stops.',
    ],
    topAttractions: ['Lingmala main viewpoint', 'Venna valley panoramas', 'Dhobi Waterfall nearby', 'Mahabaleshwar town loop'],
    bestTimeToVisit: 'June–September for active falls; October for clearer valley views.',
    localFood: ['Strawberries and cream in town', 'Corn on the cob at stalls', 'Mapro strawberry products'],
    travelTips: ['Weekend parking fills early — arrive before 10 a.m.', 'Stay behind railings — cliff edges are slick.', 'Combine with regulated Kaas visits only in bloom season.'],
    nearby: [
      { label: 'Mahabaleshwar', href: '/curated-itineraries/monsoon-trails/mahabaleshwar' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'mahabaleshwar',
  }),
  meta({
    slug: 'malshej-ghat',
    title: 'Malshej Ghat',
    subtitle: 'Thane–Ahilyanagar · flamingo clouds & roadside falls',
    description:
      'Malshej Ghat on the Kalyan–Ahmednagar road is famous for monsoon waterfalls beside the highway, misty valley views, and seasonal flamingo visitors at nearby wetlands — a classic Mumbai–Pune monsoon drive.',
    region: 'Thane district · Monsoon Trails',
    experienceLabel: 'Scenic drive',
    heroImage: PLACE_IMAGES.lonavalaHills,
    lat: 19.35,
    lng: 73.75,
    zoom: 11,
    overview: [
      'The ghat section between Khubi phata and the tunnel delivers endless monsoon drama: cascades appear directly beside the tarmac, clouds pour through the valley, and weekend traffic demands an early start.',
      'Stop only at safe pullouts; landslides and aquaplaning are real hazards in cloudbursts. Pair with Harishchandragad or Ajoba fort treks for a two-day Sahyadri circuit.',
    ],
    topAttractions: ['Roadside monsoon waterfalls', 'Valley viewpoints near Khubi', 'Harishchandragad trek access', 'Pimpalgaon Joga Dam flamingos (seasonal)'],
    bestTimeToVisit: 'July–September for falls and mist; avoid night driving in fog.',
    localFood: ['Highway bhaji stalls', 'Pithla bhakri at village dhabas', 'Hot chai at pullouts'],
    travelTips: ['From Mumbai: NH61 via Kalyan; from Pune: Ahmednagar road over the ghat.', 'Check MHADA landslide alerts before departure.', 'Carry a full windshield de-mister and fuel up in Kalyan.'],
    nearby: [
      { label: 'Harishchandragad Fort', href: '/curated-itineraries/monsoon-trails/harishchandragad-fort' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'lonavala',
  }),
  meta({
    slug: 'amboli-ghat',
    title: 'Amboli Ghat',
    subtitle: 'Sindhudurg · last hill station before the Konkan',
    description:
      'Amboli sits at the crest of the Sahyadri where the Deccan meets the Konkan — in monsoon the ghat road becomes a tunnel of cloud, forest, and waterfalls on the Sawantwadi–Kolhapur highway.',
    region: 'Sindhudurg district · Monsoon Trails',
    experienceLabel: 'Scenic drive',
    heroImage: PLACE_IMAGES.lonavalaHills,
    lat: 15.962,
    lng: 73.998,
    overview: [
      'The winding SH 121 through Amboli ghat is one of Maharashtra’s wettest drives — annual rainfall here exceeds most of the state. Mist reduces visibility to metres; when it lifts, the Konkan plain unfolds in sudden green.',
      'Base in Amboli hill station for waterfall walks, then descend to Sawantwadi or Malvan for coastal Konkan food on the return leg.',
    ],
    topAttractions: ['Amboli ghat highway viewpoints', 'Amboli hill station waterfalls', 'Sunset Point & Shirgaonkar Point', 'Konkan descent to Sawantwadi'],
    bestTimeToVisit: 'June–September for peak monsoon atmosphere; carry warm layers — Amboli is cool even in rain.',
    localFood: ['Konkan fish thali in Sawantwadi', 'Amboli village snacks', 'Sol kadhi on the coast'],
    travelTips: ['Avoid night driving in dense fog.', 'Fuel and ATMs limited on the ghat — plan ahead.', 'Check Konkan landslide updates during active systems.'],
    nearby: [
      { label: 'Amboli', href: '/curated-itineraries/monsoon-trails/amboli' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'mumbai',
  }),
  meta({
    slug: 'varandha-ghat',
    title: 'Varandha Ghat',
    subtitle: 'Pune–Mahad · Bhor plateau to Konkan',
    description:
      'Varandha Ghat on the Bhor–Mahad road drops from the Pune plateau into the Konkan through hairpins, mist, and monsoon waterfalls — a quieter alternative to Tamhini for drivers who enjoy empty ghats.',
    region: 'Pune–Raigad corridor · Monsoon Trails',
    experienceLabel: 'Scenic drive',
    heroImage: PLACE_IMAGES.lonavalaHills,
    lat: 18.18,
    lng: 73.55,
    overview: [
      'The Varandha pass connects Bhor town to Mahad on the Konkan coast. Monsoon transforms the escarpment into a wall of cloud; waterfalls streak the basalt beside the road after every shower.',
      'Combine with Mahad’s historic links to Chhatrapati Shivaji Maharaj, or continue to Raigad fort for a heritage monsoon weekend from Pune.',
    ],
    topAttractions: ['Varandha ghat hairpins', 'Konkan valley overlooks', 'Mahad heritage town', 'Raigad fort extension'],
    bestTimeToVisit: 'July–September for monsoon drama; drive only in daylight during heavy rain.',
    localFood: ['Mahad misal and vada pav', 'Konkan thali further west', 'Bhor town snacks'],
    travelTips: ['Road is narrower than expressway routes — allow extra time.', 'Watch for landslide debris after storms.', 'Pair with Raigad ropeway day trip from Mahad.'],
    nearby: [
      { label: 'Raigad Fort', href: '/curated-itineraries/monsoon-trails/raigad-fort' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'pune',
  }),
  meta({
    slug: 'ambenali-ghat',
    title: 'Ambenali Ghat',
    subtitle: 'Pune–Poladpur · Expressway descent to the Konkan',
    description:
      'Ambenali Ghat carries the Mumbai–Pune–Goa highway down from the Sahyadri crest toward Poladpur — a high-speed corridor that still delivers monsoon cloud, valley views, and waterfall streaks on the retaining walls.',
    region: 'Raigad district · Monsoon Trails',
    experienceLabel: 'Scenic drive',
    heroImage: PLACE_IMAGES.lonavalaHills,
    lat: 18.05,
    lng: 73.48,
    overview: [
      'The expressway descent near Khandala and Lonavala merges into the Ambenali section toward the Konkan — in monsoon, cloud sits at road level and waterfalls appear on cuttings beside the carriageway.',
      'Use service areas for safe stops; never halt on the main lanes. Extend to Mahabaleshwar via Poladpur or drop to Harihareshwar coast for a sea-meets-ghats loop.',
    ],
    topAttractions: ['Expressway valley views', 'Monsoon waterfalls on cuttings', 'Poladpur market stop', 'Konkan coast extensions'],
    bestTimeToVisit: 'June–September; avoid stopping on the highway shoulder — use designated areas.',
    localFood: ['Lonavala chikki en route', 'Poladpur highway dhabas', 'Konkan sol kadhi on the coast'],
    travelTips: ['Toll expressway — faster but still fog-prone in monsoon.', 'Reduce speed in aquaplaning conditions.', 'Check live traffic before weekend departures from Mumbai.'],
    nearby: [
      { label: 'Tamhini Ghat', href: '/curated-itineraries/monsoon-trails/tamhini-ghat' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'lonavala',
  }),
  meta({
    slug: 'rajgad-fort',
    title: 'Rajgad Fort',
    subtitle: 'Pune district · capital of Shivaji Maharaj’s swarajya',
    description:
      'Rajgad was the Maratha capital where Shivaji Maharaj spent most of his life — in monsoon the twin plateaus of Balekilla and Sanjeevani Machee vanish into cloud, turning the citadel into a floating island above the Konkan.',
    region: 'Pune district · Monsoon Trails',
    experienceLabel: 'Fort trek',
    heroImage: PLACE_IMAGES.sinhagad,
    lat: 18.247,
    lng: 73.68,
    overview: [
      'The trek from Gunjavane or Pali village climbs through mist-wrapped forest to massive stone ramparts. Monsoon rewards fit hikers with dramatic cloud inversions — but trails are slick and leeches appear in wet grass.',
      'Allow a full day; beginners should hire a local guide and descend before afternoon fog thickens. Pair with Torna fort for a multi-day Sahyadri heritage loop.',
    ],
    topAttractions: ['Balekilla summit palace ruins', 'Sanjeevani Machee ramparts', 'Suvela Machi cliff walk', 'Rameshwar temple on the fort'],
    bestTimeToVisit: 'June–September for monsoon atmosphere; November–February for clearer Konkan views.',
    localFood: ['Pali village poha', 'Highway misal near Nasrapur', 'Hot chai at trail base'],
    travelTips: ['Multiple route options — confirm trail status after heavy rain.', 'Carry rain cover and spare clothes in a dry bag.', 'Not recommended for monsoon beginners without a guide.'],
    nearby: [
      { label: 'Torna Fort', href: '/places-to-go/pune' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'pune',
  }),
  meta({
    slug: 'raigad-fort',
    title: 'Raigad Fort',
    subtitle: 'Raigad district · coronation seat in the clouds',
    description:
      'Raigad is where Chhatrapati Shivaji Maharaj was crowned in 1674 — monsoon mist rolls through the Maha Darwaja and Takmak Tok cliff, wrapping the hill capital in Sahyadri drama above the Konkan.',
    region: 'Raigad district · Monsoon Trails',
    experienceLabel: 'Fort trek',
    heroImage: PLACE_IMAGES.raigadFort,
    lat: 18.235,
    lng: 73.44,
    overview: [
      'A ropeway lifts visitors from the base, or climb the Maha Darwaja steps for a pilgrim’s approach through rain and wind. On clear monsoon breaks the Arabian Sea glimmers westward; on misty days the fort feels suspended above cloud.',
      'Rajyabhishek throne platform, queen’s chambers, and marketplace ruins reward unhurried exploration — allow half a day plus travel from Mahad or Pune.',
    ],
    topAttractions: ['Rajyabhishek throne platform', 'Maha Darwaja gateway', 'Ropeway & Takmak Tok cliff', 'Queen’s chambers ruins'],
    bestTimeToVisit: 'June–September for monsoon drama; arrive early on Shiv Jayanti and weekends.',
    localFood: ['Kanda bhaji at base village', 'Konkan fish thali in Mahad', 'Highway misal en route from Pune'],
    travelTips: ['Ropeway queues heavily on holidays — buy tickets early.', 'Carry rain gear; exposed ramparts are windy.', 'Grip footwear essential if climbing instead of ropeway.'],
    nearby: [
      { label: 'Timeless Icon Raigad', href: '/curated-itineraries/seven-wonders/raigad-fort' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'pune',
  }),
  meta({
    slug: 'pratapgad-fort',
    title: 'Pratapgad Fort',
    subtitle: 'Satara district · Afzal Khan memorial & valley views',
    description:
      'Built in 1656 above the Koyna valley, Pratapgad combines Maratha history with monsoon cloud — the fort’s upper and lower baileys offer Sahyadri panoramas when mist lifts after rain.',
    region: 'Satara district · Monsoon Trails',
    experienceLabel: 'Fort trek',
    heroImage: '/places/slides/mahabaleshwar/pratapgad.jpg',
    lat: 17.937,
    lng: 73.58,
    overview: [
      'Pratapgad is among the most accessible major forts from Mahabaleshwar — a motorable road reaches much of the base, with a short climb to Shivaji Maharaj’s statue and the Afzal Khan memorial.',
      'Monsoon cloud fills the Koyna gorge; the nearby Mahabaleshwar hill station makes an easy two-day heritage and waterfall circuit.',
    ],
    topAttractions: ['Shivaji Maharaj statue', 'Afzal Khan tomb memorial', 'Valley viewpoints', 'Mahabaleshwar pairing'],
    bestTimeToVisit: 'June–September for mist; winter for clearest valley views.',
    localFood: ['Mahabaleshwar strawberries', 'Corn at roadside stalls', 'Village thali near Wai'],
    travelTips: ['Road from Mahabaleshwar is steep — use lower gears in rain.', 'Statue and memorial are pilgrimage sites — dress modestly.', 'Combine with Lingmala or Mapro stops same day.'],
    nearby: [
      { label: 'Mahabaleshwar', href: '/curated-itineraries/monsoon-trails/mahabaleshwar' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'mahabaleshwar',
  }),
  meta({
    slug: 'lohagad-fort',
    title: 'Lohagad Fort',
    subtitle: 'Lonavala · monsoon gates & Pawna views',
    description:
      'Lohagad’s four gates climb through mist above Malavli — in monsoon the famous “Vinchu Kata” scorpion-tail ridge disappears into cloud while Pawna lake gleams below on clear breaks.',
    region: 'Lonavala · Monsoon Trails',
    experienceLabel: 'Fort trek',
    heroImage: PLACE_IMAGES.sinhagad,
    lat: 18.71,
    lng: 73.475,
    overview: [
      'One of the most popular monsoon treks from Mumbai and Pune, Lohagad rewards early starters with quieter trails and dramatic cloud inversions. The approach from Bhaje village passes ancient Buddhist caves at the base.',
      'Allow three to four hours on the fort; pair with Visapur for a long day or Bhaja caves for heritage context.',
    ],
    topAttractions: ['Four gated ascent', 'Vinchu Kata scorpion-tail ridge', 'Pawna lake viewpoints', 'Bhaja caves at the base'],
    bestTimeToVisit: 'June–September for monsoon green; weekdays avoid peak crowds.',
    localFood: ['Lonavala chikki', 'Corn pakoras at Malavli', 'Highway misal at toll plaza'],
    travelTips: ['Malavli suburban station is 5 km from Bhaje base.', 'Trails become streams in heavy rain — grip shoes essential.', 'Descend before dusk when fog thickens.'],
    nearby: [
      { label: 'Visapur Fort', href: '/curated-itineraries/monsoon-trails/visapur-fort' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'lonavala',
  }),
  meta({
    slug: 'harishchandragad-fort',
    title: 'Harishchandragad Fort',
    subtitle: 'Ahilyanagar · Konkan Kada cliff in monsoon',
    description:
      'Harishchandragad’s Konkan Kada — a sheer 700-metre cliff — is one of the Sahyadri’s most dramatic monsoon viewpoints when cloud pours over the edge like a waterfall into the Konkan.',
    region: 'Ahilyanagar district · Monsoon Trails',
    experienceLabel: 'Fort trek',
    heroImage: PLACE_IMAGES.kalsubaiPeak,
    lat: 19.39,
    lng: 73.77,
    overview: [
      'Multiple routes reach the plateau — Pachnai village offers the gentlest approach; Khireshwar and Nalichi Vaat demand experience and dry weather only. Monsoon transforms the temple caves and Kedareshwar lingam into a mist cathedral.',
      'Camping on the plateau is popular but requires cold-weather gear even in monsoon — leeches and slick rock are constant companions in July and August.',
    ],
    topAttractions: ['Konkan Kada cliff edge', 'Kedareshwar cave temple', 'Taramati peak sunrise', 'Malshej Ghat access routes'],
    bestTimeToVisit: 'Post-monsoon October–February for safer trekking; experienced groups only in peak monsoon.',
    localFood: ['Village meals at Pachnai base', 'Highway dhabas on Malshej road', 'Kalyan snacks before the ghat'],
    travelTips: ['Nalichi Vaat is not for monsoon beginners.', 'Hire local guides from Khireshwar or Pachnai.', 'Carry leech socks and full rain protection.'],
    nearby: [
      { label: 'Malshej Ghat', href: '/curated-itineraries/monsoon-trails/malshej-ghat' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'lonavala',
  }),
  meta({
    slug: 'mahabaleshwar',
    title: 'Mahabaleshwar',
    subtitle: 'Satara district · hill station in the clouds',
    description:
      'Maharashtra’s best-known hill station sits on the Sahyadri crest where monsoon cloud rolls through strawberry fields, Venna Lake, and viewpoints above the Konkan — classic “walking in the sky” weather.',
    region: 'Satara district · Monsoon Trails',
    experienceLabel: 'Hill station',
    heroImage: PLACE_IMAGES.mahabaleshwarHills,
    lat: 17.923,
    lng: 73.658,
    overview: [
      'From June through September Mahabaleshwar receives some of the state’s heaviest rainfall — Arthur’s Seat, Wilson Point, and Connaught Peak vanish into white-out mist one hour and reopen to valley sun the next.',
      'Lingmala and Dhobi waterfalls run full; Mapro Garden and town markets offer rainy-day shelter. Book homestays early for monsoon weekends from Mumbai and Pune.',
    ],
    topAttractions: ['Arthur’s Seat & Wilson Point', 'Venna Lake boat rides', 'Lingmala Waterfall', 'Mapro Garden & town market'],
    bestTimeToVisit: 'June–September for cloud drama; March–May for strawberries without rain.',
    localFood: ['Strawberries and cream', 'Corn on the cob', 'Chana dal pakoras in mist'],
    travelTips: ['Winding ghat roads fog heavily — daytime driving only in peak monsoon.', 'Carry warm layers — hill station rain is cold.', 'Reserve hotels for long monsoon weekends.'],
    nearby: [
      { label: 'Pratapgad Fort', href: '/curated-itineraries/monsoon-trails/pratapgad-fort' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'mahabaleshwar',
  }),
  meta({
    slug: 'bhandardara',
    title: 'Bhandardara',
    subtitle: 'Ahilyanagar · lake, dam, and monsoon mist',
    description:
      'Bhandardara wraps Arthur Lake and Wilson Dam in Sahyadri forest — monsoon fills the reservoir, powers Randha Falls, and sends cloud through the Kalsubai foothills for a classic Western Ghats escape.',
    region: 'Ahilyanagar district · Monsoon Trails',
    experienceLabel: 'Hill retreat',
    heroImage: PLACE_IMAGES.bhandardaraLake,
    lat: 19.537,
    lng: 73.755,
    overview: [
      'Resort villages dot the lakeshore; monsoon mornings often begin in complete mist before the dam wall and surrounding peaks emerge. Firefly season precedes the rains; peak monsoon brings thunder and full waterfalls.',
      'Use Bhandardara as a base for Kalsubai summit treks, Randha Falls, and Amruteshwar temple — allow two nights for weather windows.',
    ],
    topAttractions: ['Arthur Lake & Wilson Dam', 'Randha Falls', 'Amruteshwar temple', 'Kalsubai trek access'],
    bestTimeToVisit: 'July–September for monsoon lakescapes; pre-monsoon for fireflies.',
    localFood: ['Resort thalis', 'Village chai at dam viewpoints', 'Igatpuri highway snacks'],
    travelTips: ['Igatpuri is the nearest major railhead (~45 km).', 'Mobile signal is patchy — download maps offline.', 'Book lakeside stays early for monsoon weekends.'],
    nearby: [
      { label: 'Randha Falls', href: '/curated-itineraries/monsoon-trails/randha-falls' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'lonavala',
  }),
  meta({
    slug: 'amboli',
    title: 'Amboli',
    subtitle: 'Sindhudurg · hill station in perpetual mist',
    description:
      'At 690 metres in the southern Sahyadri, Amboli receives over 7 metres of rain some years — a hill station where monsoon cloud sits in the treetops and forest waterfalls are steps to the main road.',
    region: 'Sindhudurg district · Monsoon Trails',
    experienceLabel: 'Hill station',
    heroImage: PLACE_IMAGES.lonavalaHills,
    lat: 15.962,
    lng: 74.003,
    overview: [
      'Amboli’s main waterfall, Shirgaonkar Point, and Madhavgad walk are monsoon essentials. The town stays cool and wet from June through September — pack layers and waterproof footwear for every outing.',
      'Pair Amboli with Amboli Ghat drives, Sawantwadi crafts, and a Konkan coast descent to Tarkarli for a complete south-Maharashtra monsoon loop.',
    ],
    topAttractions: ['Amboli main waterfall', 'Shirgaonkar Point', 'Madavgad heritage walk', 'Sunset Point valley views'],
    bestTimeToVisit: 'June–September for peak mist and falls; carry warm rain gear year-round in monsoon.',
    localFood: ['Konkan-style thali in town', 'Sawantwadi mango products', 'Coastal fish if extending to Malvan'],
    travelTips: ['Nearest rail: Sawantwadi Road (~30 km).', 'Fog can close viewpoints without notice — flexible plans help.', 'Leeches on forest trails after rain — tuck trousers into socks.'],
    nearby: [
      { label: 'Amboli Ghat', href: '/curated-itineraries/monsoon-trails/amboli-ghat' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'mumbai',
  }),
  meta({
    slug: 'rajmachi-fort',
    title: 'Rajmachi Fort',
    subtitle: 'Lonavala · twin forts above Konkan views',
    description:
      'Rajmachi’s Shrivardhan and Manaranjan twin forts guard the Borghat trade route — monsoon treks from Lonavla or Kondivade village cross streams, waterfalls, and cloud-filled Sahyadri valleys.',
    region: 'Lonavala · Monsoon Trails',
    experienceLabel: 'Fort trek',
    heroImage: PLACE_IMAGES.lonavalaHills,
    lat: 18.825,
    lng: 73.389,
    overview: [
      'The classic route from Lonavla station follows the old Borghat path through Udhewadi village — in monsoon the trail becomes a waterfall walk with views of Duke’s Nose and the Ulhas valley when cloud clears.',
      'Overnight camping in Udhewadi is popular; homestays serve hot village meals. Allow six to eight hours return from Lonavla for a comfortable monsoon day trek.',
    ],
    topAttractions: ['Shrivardhan fort summit', 'Manaranjan bastions', 'Udhewadi village base', 'Kondana caves waterfall nearby'],
    bestTimeToVisit: 'June–September for green Sahyadri treks; avoid stream crossings during cloudburst alerts.',
    localFood: ['Udhewadi homestay thali', 'Lonavla chikki before the trek', 'Malavli misal on return'],
    travelTips: ['Lonavla suburban rail is the greenest access from Mumbai.', 'Hire a local guide in heavy monsoon.', 'Carry torch for foggy late descents.'],
    nearby: [
      { label: 'Lohagad Fort', href: '/curated-itineraries/monsoon-trails/lohagad-fort' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'lonavala',
  }),
  meta({
    slug: 'korigad-fort',
    title: 'Korigad Fort',
    subtitle: 'Lonavala · forest fort above Aamby Valley',
    description:
      'Korigad rises above Peth Shahapur near Lonavala — a moderate monsoon trek through forest to broad ramparts with views over Aamby Valley when mist lifts after rain.',
    region: 'Lonavala · Monsoon Trails',
    experienceLabel: 'Fort trek',
    heroImage: PLACE_IMAGES.lonavalaHills,
    lat: 18.778,
    lng: 73.395,
    overview: [
      'The climb from Peth Shahapur village takes roughly ninety minutes in dry season; monsoon adds stream crossings and leech-friendly forest. The fort’s large plateau holds temple ruins and wall walks safe for beginners in moderate rain.',
      'Combine with Tikona or Tung for a multi-fort weekend from Mumbai — start early to avoid afternoon fog on the descent.',
    ],
    topAttractions: ['Fort plateau ramparts', 'Temple ruins on summit', 'Aamby Valley panoramas', 'Peth Shahapur village base'],
    bestTimeToVisit: 'June–September for lush forest; clear winter days for photography.',
    localFood: ['Village chai at Peth Shahapur', 'Lonavala snacks on return', 'Highway dhabas on Mumbai–Pune road'],
    travelTips: ['Road from Lonavla via Bushi Dam is scenic but narrow.', 'Parking at village — confirm fees with locals.', 'Wear leech socks in July–August.'],
    nearby: [
      { label: 'Lonavala', href: '/places-to-go/lonavala' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'lonavala',
  }),
  meta({
    slug: 'karnala-fort',
    title: 'Karnala Fort',
    subtitle: 'Panvel · bird sanctuary summit trek',
    description:
      'Karnala pairs a bird sanctuary forest walk with a short fort climb — one of the most accessible monsoon day treks from Mumbai with ridge views over the Mumbai–Goa highway when cloud clears.',
    region: 'Raigad district · Monsoon Trails',
    experienceLabel: 'Fort trek',
    heroImage: PLACE_IMAGES.karnala,
    lat: 18.887,
    lng: 73.125,
    overview: [
      'The sanctuary gate opens onto shaded trails where monsoon brings racket-tailed drongos and hornbills; the fort pinnacle adds a steep final section with Konkan glimpses through mist.',
      'Allow four hours return from the gate; combine with Panvel breakfast and return by evening — ideal first monsoon trek for Mumbai families with teens.',
    ],
    topAttractions: ['Karnala Bird Sanctuary trails', 'Fort pinnacle climb', 'Panoramic highway views', 'Butterfly season clearings'],
    bestTimeToVisit: 'June–September for forest monsoon; winter for birding peaks.',
    localFood: ['Panvel misal before the trek', 'Sanctuary canteen on weekends', 'Highway chai on NH66'],
    travelTips: ['Pay sanctuary entry at the gate; carry ID.', 'Final fort section is exposed — avoid in lightning storms.', 'Reach by 7 a.m. on monsoon Sundays for parking.'],
    nearby: [
      { label: 'Nature Trails Karnala', href: '/curated-itineraries/nature-trails/karnala-bird-sanctuary' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'mumbai',
  }),
  meta({
    slug: 'peb-fort',
    title: 'Peb Fort (Vikatgad)',
    subtitle: 'Matheran range · ladder sections in mist',
    description:
      'Peb Fort — locally Vikatgad — rises above Neral with rock-cut steps and ladder sections that vanish into monsoon cloud, offering Matheran-range views on breaks in the rain.',
    region: 'Raigad district · Monsoon Trails',
    experienceLabel: 'Fort trek',
    heroImage: PLACE_IMAGES.lonavalaHills,
    lat: 19.005,
    lng: 73.325,
    overview: [
      'The trek from Sopara or Neral side villages combines forest, rock patches, and steep ladder climbs — monsoon makes the stone slick but the surrounding hills electric green.',
      'Experienced trekkers only in peak monsoon; carry gloves for wet ladders and plan descent before afternoon fog. Matheran toy train makes a memorable access combo.',
    ],
    topAttractions: ['Rock-cut steps & ladders', 'Caves on the plateau', 'Matheran range views', 'Neral rail access'],
    bestTimeToVisit: 'June–September for experienced groups; winter for safer ladder climbs.',
    localFood: ['Neral vada pav', 'Matheran chikki if combining', 'Hot chai at village base'],
    travelTips: ['Not suitable for monsoon beginners or children.', 'Check ladder conditions with local trekkers after storms.', 'Neral suburban station access from Mumbai.'],
    nearby: [
      { label: 'Matheran', href: '/places-to-go/lonavala' },
      { label: 'All Monsoon Trails', href: '/curated-itineraries/monsoon-trails' },
    ],
    plannerPlaceSlug: 'mumbai',
  }),
];

export type { ExtraMeta as MonsoonTrailExtraMeta };
