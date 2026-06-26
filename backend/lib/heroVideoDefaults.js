/**
 * Default hero background video filenames (under frontend/public/videos/).
 * CMS upload overrides per scope; empty file on disk → client falls back to poster.
 */
export const HERO_VIDEO_DEFAULTS = {
  home: { file: 'home-hero.mp4', poster: '/hero-image.jpeg' },
  historical: { file: 'historical-heritage.mp4', poster: '/categories/historical-heritage.jpg' },
  spiritual: { file: 'spiritual-pilgrimage.mp4', poster: '/categories/spiritual-pilgrimage.jpg' },
  adventure: { file: 'adventure-ecotourism.mp4', poster: '/categories/adventure-ecotourism.jpg' },
  culinary: { file: 'culinary-rural.mp4', poster: '/categories/culinary-rural.jpg' },
  'art-culture': { file: 'art-craft-culture.mp4', poster: '/categories/art-craft-culture.jpg' },
  urban: { file: 'urban-contemporary.mp4', poster: '/categories/urban-contemporary.jpg' },
  weddings: { file: 'weddings.mp4', poster: '/categories/weddings.jpg' },
  'place:mumbai': { file: 'mumbai.mp4', poster: '/categories/urban-contemporary.jpg' },
  'place:pune': { file: 'pune.mp4', poster: '/categories/culinary-rural.jpg' },
  'place:nashik': { file: 'nashik.mp4', poster: '/hero-image.jpeg' },
  'place:aurangabad': { file: 'aurangabad.mp4', poster: '/categories/historical-heritage.jpg' },
  'place:nagpur': { file: 'nagpur.mp4', poster: '/hero-image.jpeg' },
  'place:lonavala': { file: 'lonavala.mp4', poster: '/categories/adventure-ecotourism.jpg' },
  'place:mahabaleshwar': { file: 'mahabaleshwar.mp4', poster: '/hero-image.jpeg' },
  'place:alibaug': { file: 'alibaug.mp4', poster: '/hero-image.jpeg' },
  'place:kolhapur': { file: 'kolhapur.mp4', poster: '/categories/culinary-rural.jpg' },
  'place:shirdi': { file: 'shirdi.mp4', poster: '/categories/spiritual-pilgrimage.jpg' },
  'place:ajanta': { file: 'ajanta.mp4', poster: '/categories/historical-heritage.jpg' },
  'place:ellora': { file: 'ellora.mp4', poster: '/categories/historical-heritage.jpg' },
  'place:tadoba': { file: 'tadoba.mp4', poster: '/categories/adventure-ecotourism.jpg' },
  'place:sindhudurg': { file: 'sindhudurg.mp4', poster: '/hero-image.jpeg' },
};

export function resolveHeroVideoForScope(scope, cmsDoc) {
  const def = HERO_VIDEO_DEFAULTS[scope];
  const defaultPoster = cmsDoc?.posterUrl || def?.poster || '/hero-image.jpeg';

  if (cmsDoc?.bannerOnly) {
    return { scope, videoUrl: null, posterUrl: defaultPoster, bannerOnly: true, source: 'banner' };
  }

  if (cmsDoc?.videoUrl && cmsDoc.active !== false) {
    return {
      scope,
      videoUrl: cmsDoc.videoUrl,
      posterUrl: defaultPoster,
      bannerOnly: false,
      source: 'cms',
    };
  }

  if (def?.file) {
    return {
      scope,
      videoUrl: `/videos/${def.file}`,
      posterUrl: defaultPoster,
      bannerOnly: false,
      source: 'default',
      defaultFile: def.file,
    };
  }

  return { scope, videoUrl: null, posterUrl: defaultPoster, bannerOnly: true, source: 'none' };
}
