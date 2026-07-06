import { UNESCO_SPOTLIGHTS } from '@/data/curatedSpotlights';
import { unescoSitePath, type UnescoSiteSlug } from '@/data/unescoSites';

export type IntroStatQuickLink = {
  label: string;
  href: string;
};

export type IntroStatConfig = {
  value: string;
  label: string;
  valueKey: string;
  labelKey: string;
  href: string;
  hoverTitle: string;
  hoverDescription: string;
  previewImage: string;
  previewCta: string;
  /** Optional deep links shown inside the hover card (e.g. UNESCO sites) */
  quickLinks?: IntroStatQuickLink[];
};

export const HOME_INTRO_STATS: IntroStatConfig[] = [
  {
    value: '350+',
    label: 'Forts to walk',
    valueKey: 'home.intro.stat1Value',
    labelKey: 'home.intro.stat1Label',
    href: '/category/historical',
    hoverTitle: 'Historical & Heritage',
    hoverDescription:
      'Raigad, Sinhagad, Daulatabad, and hundreds more — trek citadels where the Maratha story was written.',
    previewImage: '/places/slides/raigad/raigad-fort.jpg',
    previewCta: 'Explore forts & heritage',
    quickLinks: [
      { label: 'Raigad Fort trek', href: '/activities/trek-raigad-fort' },
      { label: 'Historical circuits', href: '/category/historical' },
    ],
  },
  {
    value: '720 km',
    label: 'Konkan coastline',
    valueKey: 'home.intro.stat2Value',
    labelKey: 'home.intro.stat2Label',
    href: '/places-to-go/sindhudurg',
    hoverTitle: 'Konkan & Sindhudurg',
    hoverDescription:
      'Tarkarli beaches, Malvan seafood, coastal forts, and village-paced life along the Arabian Sea.',
    previewImage: '/places/slides/sindhudurg/tarkarli-beach.jpg',
    previewCta: 'Discover the Konkan coast',
    quickLinks: [
      { label: 'Sindhudurg', href: '/places-to-go/sindhudurg' },
      { label: 'Alibaug weekends', href: '/places-to-go/alibaug' },
    ],
  },
  {
    value: '7',
    label: 'UNESCO sites',
    valueKey: 'home.intro.stat3Value',
    labelKey: 'home.intro.stat3Label',
    href: '/curated-itineraries/unesco',
    hoverTitle: 'UNESCO World Heritage Sites',
    hoverDescription:
      'Rock-cut caves, Victorian Gothic stations, Sahyadri biodiversity, and Maratha hill-fort landscapes — all inscribed.',
    previewImage: '/curated/unesco/ellora-caves.jpg',
    previewCta: 'View all seven UNESCO guides',
    quickLinks: UNESCO_SPOTLIGHTS.slice(0, 4).map((s) => ({
      label: s.title,
      href: unescoSitePath(s.slug as UnescoSiteSlug),
    })),
  },
  {
    value: '1,500+',
    label: 'Years of art',
    valueKey: 'home.intro.stat4Value',
    labelKey: 'home.intro.stat4Label',
    href: '/category/art-culture',
    hoverTitle: 'Art, Craft & Culture',
    hoverDescription:
      'From Ajanta murals and Warli walls to Paithani weaving and village performance traditions.',
    previewImage: '/places/slides/pune/warli-painting.jpg',
    previewCta: 'Explore art & culture',
    quickLinks: [
      { label: 'Ajanta Caves guide', href: '/curated-itineraries/unesco/ajanta-caves' },
      { label: 'Art & culture circuits', href: '/category/art-culture' },
    ],
  },
];
