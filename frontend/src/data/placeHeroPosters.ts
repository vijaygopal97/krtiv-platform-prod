/** Unique landscape hero poster per Places to Go destination (public/places/heroes/). */
export const PLACE_HERO_POSTER: Record<string, string> = {
  mumbai: '/places/heroes/mumbai.jpg',
  pune: '/places/heroes/pune.jpg',
  nashik: '/places/heroes/nashik.jpg',
  'ajanta-ellora': '/places/heroes/ajanta-ellora.jpg',
  shirdi: '/places/heroes/shirdi.jpg',
  mahabaleshwar: '/places/heroes/mahabaleshwar.jpg',
  lonavala: '/places/heroes/lonavala.jpg',
  alibaug: '/places/heroes/alibaug.jpg',
  kolhapur: '/places/heroes/kolhapur.jpg',
  nagpur: '/places/heroes/nagpur.jpg',
  sindhudurg: '/places/heroes/sindhudurg.jpg',
  chandrapur: '/places/heroes/chandrapur.jpg',
};

export function placeHeroPosterPath(slug: string): string | undefined {
  return PLACE_HERO_POSTER[slug];
}
