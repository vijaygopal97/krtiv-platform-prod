/**
 * Destination hero slideshow — client Maharashtra Tourism / DOT library only.
 * Served from public/places/slides (no stock or Wikimedia in the carousel).
 */

import type { HeroSlideRecord } from '@/lib/heroSlideTypes';
import { assetPath } from '@/lib/basePath';

export type DestinationHeroImage = {
  src: string;
  alt: string;
};

type SlideInput = { src: string; alt: string };

/** Client Maharashtra Tourism / DOT library (public/places/slides). */
const C = {
  mumbai: {
    gateway: '/places/slides/mumbai/gateway-of-india.jpg',
    cst: '/places/slides/mumbai/cst-mumbai.jpg',
    elephanta: '/places/slides/mumbai/elephanta-caves.jpg',
  },
  pune: {
    shaniwar: '/places/slides/pune/shaniwar-wada.jpg',
    agaKhan: '/places/slides/pune/aga-khan-palace.jpg',
    sinhagad: '/places/slides/pune/sinhagad-fort.jpg',
  },
  nashik: {
    vineyard: '/places/slides/nashik/vineyard.jpg',
    trimbak: '/places/slides/nashik/trimbakeshwar.jpg',
  },
  ajantaEllora: {
    ajanta: '/places/slides/ajanta-ellora/ajanta-aerial.jpg',
    ellora: '/places/slides/ajanta-ellora/ellora-caves.jpg',
    kailasa: '/places/slides/ajanta-ellora/kailasa-temple.jpg',
    detail: '/places/slides/ajanta-ellora/ellora-detail.jpg',
  },
  mahabaleshwar: {
    venna: '/places/slides/mahabaleshwar/venna-lake.jpg',
    temple: '/places/slides/mahabaleshwar/temple.jpg',
    pratapgad: '/places/slides/mahabaleshwar/pratapgad.jpg',
    hills: '/places/slides/mahabaleshwar/hills.jpg',
  },
  lonavala: {
    hills: '/places/slides/lonavala/lonavala-hills.jpg',
    karla: '/places/slides/lonavala/karla-caves.jpg',
    matheran: '/places/slides/lonavala/matheran.jpg',
    bhaje: '/places/slides/lonavala/bhaje-caves.jpg',
  },
  alibaug: {
    murud: '/places/slides/alibaug/murud-janjira.jpg',
    diveAgar: '/places/slides/alibaug/dive-agar-beach.jpg',
    anjarle: '/places/slides/alibaug/anjarle-beach.jpg',
  },
  kolhapur: {
    mahalaxmi: '/places/slides/kolhapur/mahalaxmi-temple.jpg',
    rankala: '/places/slides/kolhapur/rankala-lake.jpg',
    panhala: '/places/slides/kolhapur/panhala-fort.jpg',
  },
  nagpur: {
    deeksha: '/places/slides/nagpur/deekshabhoomi.jpg',
    ambazari: '/places/slides/nagpur/ambazari-lake.jpg',
    dragon: '/places/slides/nagpur/dragon-palace.jpg',
  },
  sindhudurg: {
    tarkarli: '/places/slides/sindhudurg/tarkarli-beach.jpg',
    kunkeshwar: '/places/slides/sindhudurg/kunkeshwar.jpg',
    houseboat: '/places/slides/sindhudurg/houseboat.jpg',
    fort: '/places/slides/sindhudurg/sindhudurg-fort.jpg',
  },
  chandrapur: {
    tiger: '/places/slides/chandrapur/tiger-tadoba.jpg',
    safari: '/places/slides/chandrapur/tadoba-safari.jpg',
  },
};

function toSlides(slug: string, items: SlideInput[]): HeroSlideRecord[] {
  return items.map((item, i) => ({
    _id: `${slug}-hero-${i + 1}`,
    imageUrl: item.src,
    alt: item.alt,
    title: item.alt,
    kicker: item.alt.split(',')[0]?.trim() || item.alt,
    focalX: 50,
    focalY: 42,
  }));
}

const SLIDES_BY_SLUG: Record<string, SlideInput[]> = {
  mumbai: [
    { src: C.mumbai.gateway, alt: 'Gateway of India, Mumbai' },
    { src: C.mumbai.cst, alt: 'Chhatrapati Shivaji Maharaj Terminus, Mumbai' },
    { src: C.mumbai.elephanta, alt: 'Elephanta Caves, Mumbai Harbour' },
  ],
  pune: [
    { src: C.pune.shaniwar, alt: 'Shaniwar Wada, Pune' },
    { src: C.pune.agaKhan, alt: 'Aga Khan Palace, Pune' },
    { src: C.pune.sinhagad, alt: 'Sinhagad Fort, Pune' },
  ],
  nashik: [
    { src: C.nashik.trimbak, alt: 'Trimbakeshwar Temple, Nashik' },
    { src: C.nashik.vineyard, alt: 'Vineyards of Nashik' },
  ],
  'ajanta-ellora': [
    { src: C.ajantaEllora.kailasa, alt: 'Kailasa Temple, Ellora Caves' },
    { src: C.ajantaEllora.ajanta, alt: 'Ajanta Caves aerial view, Maharashtra' },
    { src: C.ajantaEllora.ellora, alt: 'Ellora Caves, Chhatrapati Sambhajinagar' },
    { src: C.ajantaEllora.detail, alt: 'Rock-cut sculptures, Ellora' },
  ],
  shirdi: [
    { src: '/places/slides/shirdi/sai-baba-temple.jpg', alt: 'Shirdi Sai Baba Temple, Ahmednagar' },
    { src: C.nashik.trimbak, alt: 'Trimbakeshwar Temple, Nashik region' },
    { src: C.kolhapur.mahalaxmi, alt: 'Mahalaxmi Temple, Kolhapur' },
  ],
  mahabaleshwar: [
    { src: C.mahabaleshwar.venna, alt: 'Venna Lake, Mahabaleshwar' },
    { src: C.mahabaleshwar.temple, alt: 'Mahabaleshwar Temple' },
    { src: C.mahabaleshwar.pratapgad, alt: 'Pratapgad Fort, Mahabaleshwar' },
    { src: C.mahabaleshwar.hills, alt: 'Sahyadri hills, Mahabaleshwar' },
  ],
  lonavala: [
    { src: C.lonavala.hills, alt: 'Lonavala hill station' },
    { src: C.lonavala.karla, alt: 'Karla Caves, Lonavala' },
    { src: C.lonavala.bhaje, alt: 'Bhaje Caves near Lonavala' },
    { src: C.lonavala.matheran, alt: 'Matheran, Maharashtra' },
  ],
  alibaug: [
    { src: C.alibaug.murud, alt: 'Murud Janjira Fort, Raigad' },
    { src: C.alibaug.diveAgar, alt: 'Dive Agar Beach, Konkan' },
    { src: C.alibaug.anjarle, alt: 'Anjarle Beach, Konkan' },
  ],
  kolhapur: [
    { src: C.kolhapur.mahalaxmi, alt: 'Mahalaxmi Temple, Kolhapur' },
    { src: C.kolhapur.rankala, alt: 'Rankala Lake, Kolhapur' },
    { src: C.kolhapur.panhala, alt: 'Panhala Fort near Kolhapur' },
  ],
  nagpur: [
    { src: C.nagpur.deeksha, alt: 'Deekshabhoomi, Nagpur' },
    { src: C.nagpur.ambazari, alt: 'Ambazari Lake, Nagpur' },
    { src: C.nagpur.dragon, alt: 'Dragon Palace Temple, Nagpur' },
  ],
  sindhudurg: [
    { src: C.sindhudurg.fort, alt: 'Sindhudurg Fort, Malvan' },
    { src: C.sindhudurg.tarkarli, alt: 'Tarkarli Beach, Sindhudurg' },
    { src: C.sindhudurg.kunkeshwar, alt: 'Kunkeshwar Temple beach, Konkan' },
    { src: C.sindhudurg.houseboat, alt: 'Houseboat, Tarkarli backwaters' },
  ],
  chandrapur: [
    { src: C.chandrapur.tiger, alt: 'Bengal tiger, Tadoba Andhari Reserve' },
    { src: C.chandrapur.safari, alt: 'Jeep safari, Tadoba' },
    { src: C.lonavala.hills, alt: 'Sahyadri forests near Chandrapur' },
  ],
};

const slideCache = new Map<string, HeroSlideRecord[]>();

export function getDestinationHeroSlides(slug: string): HeroSlideRecord[] {
  const hit = slideCache.get(slug);
  if (hit) return hit;
  const raw = SLIDES_BY_SLUG[slug];
  if (!raw?.length) return [];
  const slides = toSlides(slug, raw.slice(0, 10));
  slideCache.set(slug, slides);
  return slides;
}

export function getDestinationHeroImageUrl(slug: string, fallback = ''): string {
  return getDestinationHeroSlides(slug)[0]?.imageUrl ?? fallback;
}

export function getDestinationHero(slug: string): DestinationHeroImage | null {
  const s = getDestinationHeroSlides(slug)[0];
  if (!s) return null;
  return { src: s.imageUrl, alt: s.alt || s.title };
}

export function preloadDestinationHeroSlides(slug: string): void {
  if (typeof window === 'undefined') return;
  for (const s of getDestinationHeroSlides(slug)) {
    const img = new window.Image();
    img.src = assetPath(s.imageUrl);
  }
}

export function preloadDestinationHero(slug: string): void {
  preloadDestinationHeroSlides(slug);
}
