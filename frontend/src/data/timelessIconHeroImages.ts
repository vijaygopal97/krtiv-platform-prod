/**
 * Hero slideshows for Timeless Icons of Maharashtra detail pages.
 */
import type { HeroSlideRecord } from '@/lib/heroSlideTypes';
import { assetPath } from '@/lib/basePath';
import type { TimelessIconSlug } from '@/data/timelessIcons';

type SlideInput = { src: string; alt: string };

function gallerySlides(slug: TimelessIconSlug): SlideInput[] {
  const hero = `/curated/seven-wonders/${slug === 'global-vipassana-pagoda' ? 'global-pagoda' : slug}.jpg`;
  const base = `/curated/seven-wonders/galleries/${slug}`;
  const alts: Record<TimelessIconSlug, string[]> = {
    'ajanta-caves': [
      'Ajanta Caves, Maharashtra Timeless Icon',
      'Ajanta Buddhist murals',
      'Ajanta cliff gorge',
      'Ajanta painted ceiling',
    ],
    'ellora-caves': [
      'Ellora Kailasa Temple, Maharashtra',
      'Kailasa monolithic temple',
      'Ellora rock-cut façade',
      'Ellora cave sculpture',
    ],
    'lonar-crater': [
      'Lonar Crater Lake, Buldhana',
      'Lonar meteorite crater rim',
      'Lonar saline lake',
      'Temples at Lonar crater',
    ],
    'raigad-fort': [
      'Raigad Fort, Maratha capital',
      'Raigad citadel ramparts',
      'Raigad throne platform',
      'Konkan view from Raigad',
    ],
    'kas-plateau': [
      'Kaas Plateau wildflowers, Satara',
      'Kaas Valley of Flowers bloom',
      'Endemic blooms on Kaas Plateau',
      'Kaas Plateau boardwalk',
    ],
    'daulatabad-fort': [
      'Daulatabad Fort citadel',
      'Daulatabad Chand Minar',
      'Daulatabad hill fortress',
      'Daulatabad Andheri tunnel',
    ],
    'global-vipassana-pagoda': [
      'Global Vipassana Pagoda, Mumbai',
      'Pagoda stone dome Gorai',
      'Meditation hall interior',
      'Pagoda gardens and creek',
    ],
  };
  return [
    { src: hero, alt: alts[slug][0] },
    { src: `${base}/1.jpg`, alt: alts[slug][1] },
    { src: `${base}/2.jpg`, alt: alts[slug][2] },
    { src: `${base}/3.jpg`, alt: alts[slug][3] ?? alts[slug][2] },
  ];
}

function toSlides(slug: string, items: SlideInput[]): HeroSlideRecord[] {
  return items.map((item, i) => ({
    _id: `timeless-${slug}-hero-${i + 1}`,
    imageUrl: item.src,
    alt: item.alt,
    title: item.alt,
    kicker: item.alt.split(',')[0]?.trim() || item.alt,
    focalX: 50,
    focalY: 42,
  }));
}

const slideCache = new Map<string, HeroSlideRecord[]>();

export function getTimelessIconHeroSlides(slug: TimelessIconSlug): HeroSlideRecord[] {
  const hit = slideCache.get(slug);
  if (hit) return hit;
  const slides = toSlides(slug, gallerySlides(slug));
  slideCache.set(slug, slides);
  return slides;
}

export function getTimelessIconHeroImageUrl(slug: TimelessIconSlug, fallback = ''): string {
  return assetPath(getTimelessIconHeroSlides(slug)[0]?.imageUrl ?? fallback);
}

export function preloadTimelessIconHeroSlides(slug: TimelessIconSlug): void {
  if (typeof window === 'undefined') return;
  for (const s of getTimelessIconHeroSlides(slug)) {
    const img = new window.Image();
    img.src = assetPath(s.imageUrl);
  }
}
