/**
 * Per-page hero video assignments: theme metadata, local filenames (public/videos/),
 * and unique royalty-free remote MP4 fallbacks (Mixkit — free for commercial use).
 * Local uploads always win when the file is reachable.
 */

import { assetPath } from '@/lib/basePath';

export type HeroVideoAssignment = {
  scope: string;
  theme: string;
  poster: string;
  /** Checked in order under public/videos/ */
  localFiles: string[];
  /** Unique landscape fallback when no local file is available */
  remoteMp4: string;
};

const MIX = (slug: string) =>
  `https://assets.mixkit.co/videos/preview/mixkit-${slug}-large.mp4`;

/** Core tourism pages — each remote URL is distinct. */
export const HERO_VIDEO_CATALOG: HeroVideoAssignment[] = [
  {
    scope: 'home',
    theme: 'Maharashtra overview — landscapes, culture, travel',
    poster: '/hero-image.jpeg',
    localFiles: ['home-hero.mp4', 'hero-video.mp4'],
    remoteMp4: MIX('aerial-view-of-a-lake-and-mountains-3260'),
  },
  {
    scope: 'explore',
    theme: 'Statewide discovery and itineraries',
    poster: '/categories/explorer/home-1.jpg',
    localFiles: ['explore-hero.mp4'],
    remoteMp4: MIX('aerial-shot-of-a-road-in-the-middle-of-a-forest-1174'),
  },
  {
    scope: 'historical',
    theme: 'Forts, heritage, caves, monuments',
    poster: '/categories/historical-heritage.jpg',
    localFiles: ['heritage-hero.mp4', 'historical-heritage.mp4'],
    remoteMp4: MIX('ancient-ruins-on-a-hill-2287'),
  },
  {
    scope: 'spiritual',
    theme: 'Temples, pilgrimage, sacred journeys',
    poster: '/categories/spiritual-pilgrimage.jpg',
    localFiles: ['spiritual-hero.mp4', 'spiritual-pilgrimage.mp4'],
    remoteMp4: MIX('pagoda-temple-in-thailand-1089'),
  },
  {
    scope: 'adventure',
    theme: 'Trekking, forests, waterfalls, ecotourism',
    poster: '/categories/adventure-ecotourism.jpg',
    localFiles: ['adventure-hero.mp4', 'adventure-ecotourism.mp4'],
    remoteMp4: MIX('waterfall-flowing-down-a-rocky-mountain-2792'),
  },
  {
    scope: 'culinary',
    theme: 'Local food, villages, rural life',
    poster: '/categories/culinary-rural.jpg',
    localFiles: ['culinary-hero.mp4', 'culinary-rural.mp4'],
    remoteMp4: MIX('chef-preparing-a-dish-with-fire-3180'),
  },
  {
    scope: 'art-culture',
    theme: 'Arts, crafts, festivals, performances',
    poster: '/categories/art-craft-culture.jpg',
    localFiles: ['culture-hero.mp4', 'wildlife-hero.mp4', 'art-craft-culture.mp4'],
    remoteMp4: MIX('colorful-festival-lights-at-night-4853'),
  },
  {
    scope: 'urban',
    theme: 'City skylines, contemporary urban life, coast',
    poster: '/categories/urban-contemporary.jpg',
    localFiles: ['beaches-hero.mp4', 'urban-contemporary.mp4', 'urban-hero.mp4'],
    remoteMp4: MIX('aerial-panorama-of-a-city-at-sunset-4788'),
  },
  {
    scope: 'weddings',
    theme: 'Destination weddings and celebrations',
    poster: '/categories/weddings.jpg',
    localFiles: ['wedding-hero.mp4', 'weddings.mp4'],
    remoteMp4: MIX('wedding-couple-holding-hands-2782'),
  },
];

const PLACE_VIDEO_POOL: { slug: string; remoteSlug: string; poster: string }[] = [
  { slug: 'mumbai', remoteSlug: 'city-traffic-at-night-11', poster: '/places/heroes/mumbai.jpg' },
  { slug: 'pune', remoteSlug: 'aerial-view-of-a-city-road-5038', poster: '/places/heroes/pune.jpg' },
  { slug: 'nashik', remoteSlug: 'vineyard-rows-at-sunset-2488', poster: '/places/heroes/nashik.jpg' },
  { slug: 'nagpur', remoteSlug: 'forest-stream-in-the-sunlight-529', poster: '/places/heroes/nagpur.jpg' },
  { slug: 'lonavala', remoteSlug: 'beautiful-aerial-shot-of-a-lake-surrounded-by-trees-3281', poster: '/places/heroes/lonavala.jpg' },
  { slug: 'mahabaleshwar', remoteSlug: 'mountain-landscape-with-fog-4158', poster: '/places/heroes/mahabaleshwar.jpg' },
  { slug: 'alibaug', remoteSlug: 'waves-coming-to-the-shore-1164', poster: '/places/heroes/alibaug.jpg' },
  { slug: 'kolhapur', remoteSlug: 'close-up-of-traditional-food-3181', poster: '/places/heroes/kolhapur.jpg' },
  { slug: 'shirdi', remoteSlug: 'prayer-candles-in-a-temple-1088', poster: '/places/heroes/shirdi.jpg' },
  { slug: 'ajanta-ellora', remoteSlug: 'tourist-taking-a-photo-of-a-mountain-5037', poster: '/places/heroes/ajanta-ellora.jpg' },
  { slug: 'chandrapur', remoteSlug: 'herd-of-deer-running-in-the-forest-3053', poster: '/places/heroes/chandrapur.jpg' },
  { slug: 'sindhudurg', remoteSlug: 'aerial-view-of-beach-waves-5192', poster: '/places/heroes/sindhudurg.jpg' },
];

for (const p of PLACE_VIDEO_POOL) {
  HERO_VIDEO_CATALOG.push({
    scope: `place:${p.slug}`,
    theme: `${p.slug} destination`,
    poster: p.poster ?? '/hero-image.jpeg',
    localFiles: [`${p.slug}.mp4`, `${p.slug}-hero.mp4`],
    remoteMp4: MIX(p.remoteSlug),
  });
}

const catalogByScope = new Map(HERO_VIDEO_CATALOG.map((e) => [e.scope, e]));

export function getHeroVideoAssignment(scope: string): HeroVideoAssignment | undefined {
  return catalogByScope.get(scope);
}

export function posterForScope(scope: string, fallbackPoster: string): string {
  const a = getHeroVideoAssignment(scope);
  return assetPath(a?.poster || fallbackPoster);
}

/** Sync resolve — prefers first local path (may 404 until uploaded). */
export function resolveHeroVideoForScope(scope: string, fallbackPoster: string) {
  const assignment = getHeroVideoAssignment(scope);
  const poster = posterForScope(scope, fallbackPoster);
  if (!assignment) {
    return { videoSrc: null as string | null, poster, source: 'none' as const };
  }
  const local = assignment.localFiles[0];
  return {
    videoSrc: local ? assetPath(`/videos/${local}`) : null,
    poster,
    source: 'local' as const,
  };
}

export async function probeVideoUrl(url: string): Promise<boolean> {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    if (!res.ok) return false;
    const type = res.headers.get('content-type') ?? '';
    return type.includes('video') || type.includes('octet-stream') || url.includes('.mp4');
  } catch {
    return false;
  }
}

export type ResolvedHeroVideo = {
  videoSrc: string | null;
  poster: string;
  source: 'local' | 'remote' | 'poster';
};

/**
 * Picks the best playable URL: local project assets first, then themed remote fallback.
 */
export async function resolveHeroVideoAsync(
  scope: string,
  fallbackPoster: string
): Promise<ResolvedHeroVideo> {
  const assignment = getHeroVideoAssignment(scope);
  const poster = posterForScope(scope, fallbackPoster);

  if (!assignment) {
    return { videoSrc: null, poster, source: 'poster' };
  }

  for (const file of assignment.localFiles) {
    const localUrl = assetPath(`/videos/${file}`);
    if (await probeVideoUrl(localUrl)) {
      return { videoSrc: localUrl, poster, source: 'local' };
    }
  }

  if (assignment.remoteMp4) {
    return { videoSrc: assignment.remoteMp4, poster, source: 'remote' };
  }

  return { videoSrc: null, poster, source: 'poster' };
}

/** Legacy map for filenames (admin/docs). */
export const HERO_VIDEO_DEFAULTS: Record<string, { file: string; poster: string }> =
  Object.fromEntries(
    HERO_VIDEO_CATALOG.filter((c) => !c.scope.startsWith('place:')).map((c) => [
      c.scope,
      { file: c.localFiles[0] ?? '', poster: c.poster },
    ])
  );

export function heroVideoScopeForCategory(slug: string) {
  return slug;
}

export function heroVideoScopeForPlace(slug: string) {
  return `place:${slug}`;
}
