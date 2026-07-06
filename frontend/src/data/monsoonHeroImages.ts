import type { HeroSlideRecord } from '@/lib/heroSlideTypes';
import { assetPath } from '@/lib/basePath';
import { PLACE_IMAGES } from '@/data/placeImageLibrary';
import type { MonsoonTrailSlug } from '@/data/monsoonTrails';

type SlideInput = { src: string; alt: string };

const GALLERY_ALT: Partial<Record<MonsoonTrailSlug, string[]>> = {
  'thoseghar-waterfalls': [
    'Thoseghar Waterfalls panorama, Satara',
    'Main cascade at Thoseghar during monsoon',
    'Tiered falls at Thoseghar gorge',
    'Monsoon waterfall mist at Thoseghar',
    'Forest viewpoint above Thoseghar falls',
    'Thoseghar waterfall series from the platform',
  ],
  'devkund-waterfall': [
    'Devkund plunge waterfall, Bhira Raigad',
    'Turquoise pool at Devkund waterfall',
    'Forest trail approach to Devkund',
    'Devkund sacred plunge pool from the rim',
  ],
  'tamhini-ghat': [
    'Tamhini Ghat in monsoon rain, Pune district',
    'Plus Valley view from Tamhini Ghat',
    'Highway through Tamhini Ghat waterfalls',
    'Misty forest road in Tamhini Ghat',
    'Tamhini Ghat rainy season landscape',
    'Western Ghats cloud forest at Tamhini',
  ],
  'visapur-fort': [
    'Visapur Fort ruins in monsoon, Lonavala',
    'Visapur Fort plateau and ramparts',
    'Stone walls of Visapur Fort Maharashtra',
    'Visapur Fort trek trail in mist',
    'Maratha fort architecture at Visapur',
  ],
};

const GALLERY_COUNTS: Partial<Record<MonsoonTrailSlug, number>> = {
  'thoseghar-waterfalls': 3,
  'devkund-waterfall': 3,
  'tamhini-ghat': 5,
  'visapur-fort': 4,
};

const HERO_FALLBACK: Partial<Record<MonsoonTrailSlug, string>> = {
  'vajrai-waterfall': PLACE_IMAGES.mahabaleshwarHills,
  'randha-falls': PLACE_IMAGES.bhandardaraLake,
  'lingmala-waterfall': PLACE_IMAGES.mahabaleshwarHills,
  'malshej-ghat': PLACE_IMAGES.lonavalaHills,
  'amboli-ghat': PLACE_IMAGES.lonavalaHills,
  'varandha-ghat': PLACE_IMAGES.lonavalaHills,
  'ambenali-ghat': PLACE_IMAGES.lonavalaHills,
  'rajgad-fort': PLACE_IMAGES.sinhagad,
  'raigad-fort': PLACE_IMAGES.raigadFort,
  'pratapgad-fort': '/places/slides/mahabaleshwar/pratapgad.jpg',
  'lohagad-fort': PLACE_IMAGES.sinhagad,
  'harishchandragad-fort': PLACE_IMAGES.kalsubaiPeak,
  mahabaleshwar: PLACE_IMAGES.mahabaleshwarHills,
  bhandardara: PLACE_IMAGES.bhandardaraLake,
  amboli: PLACE_IMAGES.lonavalaHills,
  'rajmachi-fort': PLACE_IMAGES.lonavalaHills,
  'korigad-fort': PLACE_IMAGES.lonavalaHills,
  'karnala-fort': PLACE_IMAGES.karnala,
  'peb-fort': PLACE_IMAGES.lonavalaHills,
};

function gallerySlides(slug: MonsoonTrailSlug): SlideInput[] {
  const hero = `/curated/monsoon-trails/${slug}.jpg`;
  const base = `/curated/monsoon-trails/galleries/${slug}`;
  const count = GALLERY_COUNTS[slug];
  const alts = GALLERY_ALT[slug];

  if (count && alts) {
    const items: SlideInput[] = [{ src: hero, alt: alts[0] }];
    for (let i = 1; i <= count; i++) {
      items.push({ src: `${base}/${i}.jpg`, alt: alts[i] ?? `${slug} ${i}` });
    }
    return items;
  }

  const fallback = HERO_FALLBACK[slug] ?? '/curated/monsoon-trails/tamhini-ghat.jpg';
  const label = slug.replace(/-/g, ' ');
  return [{ src: fallback, alt: `${label} in monsoon, Maharashtra` }];
}

function toSlides(slug: string, items: SlideInput[]): HeroSlideRecord[] {
  return items.map((item, i) => ({
    _id: `monsoon-${slug}-hero-${i + 1}`,
    imageUrl: item.src,
    alt: item.alt,
    title: item.alt,
    focalX: 50,
    focalY: 45,
  }));
}

const slideCache = new Map<string, HeroSlideRecord[]>();

export function getMonsoonHeroSlides(slug: MonsoonTrailSlug): HeroSlideRecord[] {
  const hit = slideCache.get(slug);
  if (hit) return hit;
  const slides = toSlides(slug, gallerySlides(slug));
  slideCache.set(slug, slides);
  return slides;
}

export function getMonsoonHeroImageUrl(slug: MonsoonTrailSlug, fallback: string): string {
  const slides = getMonsoonHeroSlides(slug);
  return assetPath(slides[0]?.imageUrl ?? fallback);
}

export function preloadMonsoonHeroSlides(slug: MonsoonTrailSlug): void {
  if (typeof window === 'undefined') return;
  for (const s of getMonsoonHeroSlides(slug)) {
    const img = new window.Image();
    img.src = assetPath(s.imageUrl);
  }
}
