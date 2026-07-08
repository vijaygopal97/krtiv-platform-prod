/** Rich spotlight cards for UNESCO & Timeless Icons curated trails. */

export type CuratedSpotlight = {
  slug: string;
  title: string;
  location: string;
  image: string;
  badge: string;
  summary: string;
  body: string;
  highlights: string[];
  /** Optional link to a related destination or activity page */
  relatedHref?: string;
  relatedLabel?: string;
  /** When set, card links here instead of the default trail detail path */
  cardHref?: string;
};

export const UNESCO_SPOTLIGHTS: CuratedSpotlight[] = [
  {
    slug: 'ajanta-caves',
    title: 'Ajanta Caves',
    location: 'Chhatrapati Sambhajinagar district',
    image: '/curated/unesco/ajanta-caves.jpg',
    badge: 'UNESCO · 1983',
    summary:
      'Thirty rock-cut Buddhist cave monuments with paintings and sculptures spanning nearly nine centuries of Indian art.',
    body:
      'Carved into a horseshoe-shaped cliff above the Waghora river, Ajanta preserves some of the finest surviving Buddhist mural cycles in the world. Monks shaped these chambers between the 2nd century BCE and about 650 CE, leaving behind narrative frescoes of the Jataka tales, serene Buddha images, and delicate floral motifs that still glow in the filtered cave light. Allow a full day — Cave 1, 2, 16, 17, and 26 reward unhurried viewing.',
    highlights: [
      'Mahayana & Theravada Buddhist art in one ravine',
      'Narrative murals of Buddha’s life and Jataka tales',
      'Best visited October–March with early-morning light',
    ],
    relatedHref: '/places-to-go/ajanta-ellora',
    relatedLabel: 'Plan an Ajanta & Ellora circuit',
  },
  {
    slug: 'ellora-caves',
    title: 'Ellora Caves',
    location: 'Verul, Chhatrapati Sambhajinagar district',
    image: '/curated/unesco/ellora-caves.jpg',
    badge: 'UNESCO · 1983',
    summary:
      'Thirty-four monasteries and temples — Buddhist, Hindu, and Jain — cut from a single basalt escarpment, crowned by the monolithic Kailasa temple.',
    body:
      'Ellora is a masterclass in religious coexistence carved in stone. Across two kilometres of cliff face, craftsmen worked from the 6th to 12th centuries to create cave complexes for three faiths. Cave 16, the Kailasa Temple, is the showpiece: an entire multi-storey shrine hewn downward from living rock. Pair Ellora with Ajanta on a three-day heritage loop through the Deccan.',
    highlights: [
      'Monolithic Kailasa Temple (Cave 16)',
      'Buddhist, Brahmanical & Jain cave groups',
      'Evening sound-and-light shows in season',
    ],
    relatedHref: '/places-to-go/ajanta-ellora',
    relatedLabel: 'Plan an Ajanta & Ellora circuit',
  },
  {
    slug: 'elephanta-caves',
    title: 'Elephanta Caves',
    location: 'Elephanta Island, Mumbai Harbour',
    image: '/curated/unesco/elephanta-caves.jpg',
    badge: 'UNESCO · 1987',
    summary:
      'Shaivite rock-cut temples on Gharapuri island — reached by ferry from the Gateway of India — with the iconic Trimurti sculpture.',
    body:
      'A short boat ride from South Mumbai deposits you on an island where 5th–8th century sculptors shaped volcanic rock into caverns devoted to Lord Shiva. The colossal Trimurti — three faces of Shiva as creator, preserver, and destroyer — anchors Cave 1. Combine the ferry crossing, cave walk, and harbour views for a half-day escape from the city bustle.',
    highlights: [
      'Trimurti Shiva sculpture in the main cave',
      'Ferry from Gateway of India (~1 hour each way)',
      'Island viewpoints over Mumbai harbour',
    ],
    relatedHref: '/places-to-go/mumbai',
    relatedLabel: 'Explore Mumbai itineraries',
  },
  {
    slug: 'csmt',
    title: 'Chhatrapati Shivaji Maharaj Terminus',
    location: 'Fort, Mumbai',
    image: '/curated/unesco/csmt.jpg',
    badge: 'UNESCO · 2004',
    summary:
      'Victorian Gothic Revival architecture fused with Indian palace motifs — Mumbai’s great railway cathedral and a working UNESCO landmark.',
    body:
      'Designed by Frederick William Stevens and completed in 1887, CSMT (formerly Victoria Terminus) announced Bombay as the mercantile capital of British India. Stone domes, pointed arches, gargoyles, and a soaring central dome rise above one of the country’s busiest stations. Visit at blue hour when the façade is illuminated, then walk the surrounding Fort precinct for colonial streetscapes.',
    highlights: [
      'High Victorian Gothic with Indian craftsmanship',
      'Active UNESCO site — still Maharashtra’s principal rail hub',
      'Best photographed at dusk from the station forecourt',
    ],
    relatedHref: '/places-to-go/mumbai',
    relatedLabel: 'Explore Mumbai itineraries',
  },
  {
    slug: 'western-ghats',
    title: 'Western Ghats',
    location: 'Sahyadri range across Maharashtra',
    image: '/curated/unesco/western-ghats.jpg',
    badge: 'UNESCO · 2012',
    summary:
      'One of the world’s eight “hottest hotspots” of biodiversity — mist forests, endemic species, and monsoon-fed peaks across the Sahyadri.',
    body:
      'Maharashtra’s share of the Western Ghats UNESCO serial site protects ancient rainforests, grasslands, and river systems that feed the Konkan coast. Trek misty ridges, spot endemic flora on the Kaas Plateau, or base yourself in hill stations like Mahabaleshwar and Lonavala for cooler escapes. Monsoon transforms the ghats into waterfalls and cloud forests — plan trails with local guides in peak rain.',
    highlights: [
      'Global biodiversity hotspot with endemic wildlife',
      'Trekking bases: Kalsubai, Bhimashankar, Harishchandragad',
      'Monsoon season (June–September) for mist & waterfalls',
    ],
    relatedHref: '/places-to-go/lonavala',
    relatedLabel: 'Hill-station escapes',
  },
  {
    slug: 'art-deco-mumbai',
    title: 'Victorian Gothic & Art Deco Ensembles of Mumbai',
    location: 'Fort, Marine Drive & Oval Maidan, Mumbai',
    image: '/curated/unesco/art-deco-mumbai.jpg',
    badge: 'UNESCO · 2018',
    summary:
      'The world’s second-largest collection of Art Deco buildings, set against Victorian Gothic landmarks around the Oval Maidan seafront.',
    body:
      'Mumbai’s 19th-century Gothic public buildings face a sweep of 1930s Art Deco apartments along Marine Drive and Backbay — a rare urban ensemble recognised by UNESCO. Self-guided walks from Regal Cinema to the Oval Maidan reveal ziggurat motifs, nautical bas-reliefs, and pastel façades. Heritage walks and the Kala Ghoda arts district add context to the architecture.',
    highlights: [
      'Art Deco along Marine Drive & Backbay',
      'Victorian Gothic around Oval Maidan & Fort',
      'Ideal as a half-day heritage walking circuit',
    ],
    relatedHref: '/places-to-go/mumbai',
    relatedLabel: 'Explore Mumbai itineraries',
  },
  {
    slug: 'maratha-military-landscapes',
    title: 'Maratha Military Landscapes of India',
    location: 'Raigad, Rajgad, Shivneri & allied forts',
    image: '/curated/unesco/maratha-military-landscapes.jpg',
    badge: 'UNESCO · 2024',
    summary:
      'A serial inscription of Maratha hill forts — including Raigad, the capital of Chhatrapati Shivaji Maharaj’s swarajya.',
    body:
      'Maharashtra’s newest UNESCO listing honours the strategic hill-fort network that underpinned the Maratha empire. Raigad — Shivaji’s coronation seat — commands the Konkan with dramatic cliff walls and ropeway access. Combine Raigad with Rajgad or Torna for a multi-day fort trail through living history, monsoon cloud, and Sahyadri panoramas.',
    highlights: [
      'Raigad Fort — coronation site of Shivaji Maharaj',
      'Serial site spanning 12 forts across Maharashtra & Tamil Nadu',
      'Ropeway or trek access; best in post-monsoon months',
    ],
    relatedHref: '/category/historical',
    relatedLabel: 'Historical & heritage circuits',
  },
];

/** MTDC × ABP Majha 2013 list — Ajanta & Ellora shown separately (not as a city destination). */
export const SEVEN_WONDERS_SPOTLIGHTS: CuratedSpotlight[] = [
  {
    slug: 'ajanta-caves',
    title: 'Ajanta Caves',
    location: 'Chhatrapati Sambhajinagar district',
    image: '/curated/seven-wonders/ajanta-caves.jpg',
    badge: 'Timeless Icon · 2013',
    summary:
      'Rock-cut Buddhist caves whose 2,000-year-old murals remain among the greatest achievements of ancient Indian painting.',
    body:
      'Voted one of Maharashtra’s seven wonders, Ajanta draws art historians and first-time travellers alike. The cliff-face monasteries overlook a wooded gorge; inside, painted ceilings and sculpted Buddhas narrate centuries of devotion. Arrive early, carry a torch for darker cells, and allow time for the Archaeological Museum at the base.',
    highlights: ['UNESCO World Heritage Site', 'Caves 1, 2 & 17 for mural highlights', '~2.5 hr drive from Chhatrapati Sambhajinagar'],
    relatedHref: '/places-to-go/ajanta-ellora',
    relatedLabel: 'Plan your visit',
  },
  {
    slug: 'ellora-caves',
    title: 'Ellora Caves',
    location: 'Verul, Chhatrapati Sambhajinagar district',
    image: '/curated/seven-wonders/ellora-caves.jpg',
    badge: 'Timeless Icon · 2013',
    summary:
      'The monolithic Kailasa Temple — an entire mountain carved into a shrine — anchors this wonder of the Deccan.',
    body:
      'Where Ajanta whispers in Buddhist quiet, Ellora declares its ambition in stone. The Kailasa complex alone could fill a day: elephants, pillars, and galleries chiselled from a single rock face. Jain and Buddhist caves nearby complete a tri-faith pilgrimage through Maharashtra’s golden age of rock architecture.',
    highlights: ['Kailasa Temple (Cave 16) centerpiece', '34 caves across three traditions', 'Pair with Ajanta on a 2–3 day loop'],
    relatedHref: '/places-to-go/ajanta-ellora',
    relatedLabel: 'Plan your visit',
  },
  {
    slug: 'lonar-crater',
    title: 'Lonar Crater Lake',
    location: 'Buldhana district',
    image: '/curated/seven-wonders/lonar-crater.jpg',
    badge: 'Timeless Icon · 2013',
    summary:
      'A saline meteorite-impact lake inside the only hyper-velocity crater in basaltic rock on Earth.',
    body:
      'Formed roughly 50,000 years ago, Lonar’s emerald rim contrasts with temple ruins scattered around the lake shore. The water’s alkalinity supports unique micro-organisms studied by scientists worldwide. Circumambulate the crater rim at dawn, visit Daitya Sudan temple in Lonar town, and stay overnight for stargazing far from city lights.',
    highlights: ['Rare geological wonder — impact crater in basalt', 'Ancient temples on the crater rim', 'Best October–February'],
  },
  {
    slug: 'raigad-fort',
    title: 'Raigad Fort',
    location: 'Raigad district',
    image: '/curated/seven-wonders/raigad-fort.jpg',
    badge: 'Timeless Icon · 2013',
    summary:
      'The hill capital where Chhatrapati Shivaji Maharaj was crowned — fort walls, royal ruins, and Konkan vistas.',
    body:
      'Raigad embodies Maratha sovereignty: the queen’s chambers, granaries, and the throne platform still echo with history. A ropeway lifts visitors to the citadel, or you can climb the Maha Darwaja steps for a pilgrim’s approach. On clear days the Konkan coast unfurls to the west — combine with Mahad or Pali for a heritage weekend.',
    highlights: ['Coronation site of Shivaji Maharaj', 'Ropeway & trekking access', 'UNESCO Maratha Military Landscapes site'],
    relatedHref: '/category/historical',
    relatedLabel: 'Fort heritage trails',
  },
  {
    slug: 'kas-plateau',
    title: 'Kaas Plateau',
    location: 'Satara district',
    image: '/curated/seven-wonders/kas-plateau.jpg',
    badge: 'Timeless Icon · 2013',
    summary:
      'The “Valley of Flowers of Maharashtra” — a UNESCO natural heritage plateau blanketed in endemic monsoon blooms.',
    body:
      'For a few weeks after the rains, Kaas erupts in carpets of Smithia, Utricularia, and orchids found nowhere else on the planet. Boardwalks protect the fragile ecosystem; entry is regulated in peak bloom season (typically September). Base in Satara or Mahabaleshwar and pair with Thoseghar waterfalls or Sajjangad fort.',
    highlights: ['Biodiversity hotspot — 850+ flowering species', 'Seasonal access during monsoon bloom', 'Part of the Western Ghats UNESCO site'],
    relatedHref: '/places-to-go/mahabaleshwar',
    relatedLabel: 'Nearby hill-station stays',
  },
  {
    slug: 'daulatabad-fort',
    title: 'Daulatabad Fort',
    location: 'Daulatabad (Devagiri), Chhatrapati Sambhajinagar district',
    image: '/curated/seven-wonders/daulatabad-fort.jpg',
    badge: 'Timeless Icon · 2013',
    summary:
      'The “unconquerable” Deccan citadel — moats, tunnels, and a hilltop stronghold that once commanded medieval trade routes.',
    body:
      'Rising above the plains near Chhatrapati Sambhajinagar, Daulatabad’s layered defences include a pitch-dark zigzag passage engineered to confuse invaders. Climb through the Andheri tunnel with a guide, explore the Chand Minar, and survey the horizon from the summit. Easily combined with Ellora on the same trip.',
    highlights: ['Medieval Deccan military architecture', 'Famous dark passage (Andheri)', '30 minutes from Ellora caves'],
    relatedHref: '/places-to-go/ajanta-ellora',
    relatedLabel: 'Chhatrapati Sambhajinagar heritage loop',
  },
  {
    slug: 'global-vipassana-pagoda',
    title: 'Global Vipassana Pagoda',
    location: 'Gorai, northwest Mumbai',
    image: '/curated/seven-wonders/global-pagoda.jpg',
    badge: 'Timeless Icon · 2013',
    summary:
      'A monumental stone dome — among the largest of its kind — honouring Vipassana meditation on the edge of the Arabian Sea.',
    body:
      'Completed in 2009, the pagoda’s Burmese-inspired architecture shelters the world’s largest stone dome built without supporting pillars. Visitors can explore the meditation hall, museum galleries on Vipassana, and peaceful gardens overlooking Gorai creek. Reachable by ferry from Borivali or road via Mira Road — ideal for a contemplative half-day from Mumbai.',
    highlights: ['Largest stone dome of its type', 'Seafront meditation complex', 'Free public visiting hours'],
    relatedHref: '/places-to-go/mumbai',
    relatedLabel: 'Mumbai day trips',
  },
];

export function getSpotlightsForTrail(trail: 'unesco' | 'seven-wonders'): CuratedSpotlight[] {
  return trail === 'unesco' ? UNESCO_SPOTLIGHTS : SEVEN_WONDERS_SPOTLIGHTS;
}

export function getSpotlightBySlug(
  trail: 'unesco' | 'seven-wonders',
  slug: string,
): CuratedSpotlight | undefined {
  return getSpotlightsForTrail(trail).find((s) => s.slug === slug);
}
