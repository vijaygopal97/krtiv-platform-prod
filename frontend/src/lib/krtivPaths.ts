import { assetPath } from '@/lib/basePath';

export const krtivLogo = () => assetPath('/krtiv/maharashtra-logo.png');
/** White logo for transparent header over hero imagery */
export const krtivLogoHero = () => assetPath('/krtiv/maharashtra-logo-hero.png');
export const krtivVisitLogo = () => assetPath('/krtiv/visit-maharashtra-thin.png');
export const krtivHeroImage = () => assetPath('/krtiv/hero-image.jpeg');

export function categoryImage(filename: string) {
  return assetPath(`/categories/${filename}`);
}
