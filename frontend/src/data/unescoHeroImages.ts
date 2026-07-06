/**
 * Hero slideshows for individual UNESCO site pages.
 */
import type { HeroSlideRecord } from '@/lib/heroSlideTypes';
import { assetPath } from '@/lib/basePath';
import type { UnescoSiteSlug } from '@/data/unescoSites';

type SlideInput = { src: string; alt: string };

function gallerySlides(slug: UnescoSiteSlug): SlideInput[] {
  const hero = `/curated/unesco/${slug === 'art-deco-mumbai' ? 'art-deco-mumbai' : slug === 'csmt' ? 'csmt' : slug}.jpg`;
  const base = `/curated/unesco/galleries/${slug}`;
  const alts: Record<UnescoSiteSlug, string[]> = {
    'ajanta-caves': ['Ajanta Caves murals', 'Ajanta Buddhist sculpture', 'Ajanta cliff ravine'],
    'ellora-caves': ['Kailasa Temple, Ellora', 'Ellora rock-cut caves', 'Ellora Jain cave sculpture'],
    'elephanta-caves': ['Trimurti sculpture, Elephanta', 'Elephanta Caves island', 'Elephanta harbour view'],
    csmt: ['CSMT illuminated at night', 'CSMT interior hall', 'Chhatrapati Shivaji Maharaj Terminus façade'],
    'western-ghats': ['Kaas Plateau wildflowers', 'Western Ghats Sahyadri ridges', 'Kalsubai peak sunrise'],
    'art-deco-mumbai': ['Art Deco Marine Drive', 'Oval Maidan heritage skyline', 'Regal Cinema Art Deco'],
    'maratha-military-landscapes': ['Raigad Fort citadel', 'Rajgad Sahyadri fort', 'Shivneri hill fort'],
  };
  return [
    { src: hero, alt: alts[slug][0] },
    { src: `${base}/1.jpg`, alt: alts[slug][0] },
    { src: `${base}/2.jpg`, alt: alts[slug][1] },
    { src: `${base}/3.jpg`, alt: alts[slug][2] },
  ];
}

function toSlides(slug: string, items: SlideInput[]): HeroSlideRecord[] {
  return items.map((item, i) => ({
    _id: `unesco-${slug}-hero-${i + 1}`,
    imageUrl: item.src,
    alt: item.alt,
    title: item.alt,
    kicker: item.alt.split(',')[0]?.trim() || item.alt,
    focalX: 50,
    focalY: 42,
  }));
}

const slideCache = new Map<string, HeroSlideRecord[]>();

export function getUnescoHeroSlides(slug: UnescoSiteSlug): HeroSlideRecord[] {
  const hit = slideCache.get(slug);
  if (hit) return hit;
  const slides = toSlides(slug, gallerySlides(slug));
  slideCache.set(slug, slides);
  return slides;
}

export function getUnescoHeroImageUrl(slug: UnescoSiteSlug, fallback = ''): string {
  return getUnescoHeroSlides(slug)[0]?.imageUrl ?? fallback;
}

export function preloadUnescoHeroSlides(slug: UnescoSiteSlug): void {
  if (typeof window === 'undefined') return;
  for (const s of getUnescoHeroSlides(slug)) {
    const img = new window.Image();
    img.src = assetPath(s.imageUrl);
  }
}
