import { assetPath } from '@/lib/basePath';
import labelOverrides from '@/data/exploreLabelOverrides.json';

type ExploreLabelOverride = {
  primaryTag: string;
  primaryLabel: string;
  tags?: Array<{ slug: string; label: string }>;
};

const LABEL_OVERRIDES = labelOverrides as Record<string, ExploreLabelOverride>;

export type ExploreTag = {
  slug: string;
  label: string;
  count: number;
};

export type ExploreCatalogItem = {
  id: string;
  name: string;
  path: string;
  source: string;
  tags: Array<{ slug: string; label: string }>;
  primaryTag: string;
  primaryLabel: string;
};

export type ExploreCatalog = {
  generatedAt: string;
  total: number;
  tags: ExploreTag[];
  items: ExploreCatalogItem[];
};

/** Stable save key for explore photos in the user's account. */
export function explorePhotoSlug(fileId: string): string {
  return `explore:${fileId}`;
}

/** Google CDN — reliable in <img> tags (Drive /uc links often fail in browsers). */
export function exploreImageUrl(fileId: string, width = 480): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;
}

export function exploreThumbUrl(fileId: string, width = 480): string {
  return exploreImageUrl(fileId, width);
}

export function exploreFullUrl(fileId: string): string {
  return exploreImageUrl(fileId, 1920);
}

export type ExplorePhotoDto = {
  id: string;
  name: string;
  primaryLabel: string;
  thumb: string;
  full: string;
};

/** Next.js route — not proxied to the Node backend (see next.config rewrites). */
export function explorePhotosApiPath(): string {
  return assetPath('/gallery-api/explore/photos');
}

/** Manual corrections for misfiled Drive photos (folder path ≠ actual place). */
export function applyExploreLabelOverride(item: ExploreCatalogItem): ExploreCatalogItem {
  const override = LABEL_OVERRIDES[item.id];
  if (!override) return item;
  const tags = override.tags ?? [{ slug: override.primaryTag, label: override.primaryLabel }];
  return {
    ...item,
    primaryTag: override.primaryTag,
    primaryLabel: override.primaryLabel,
    tags,
  };
}

export function toExplorePhotoDto(item: ExploreCatalogItem): ExplorePhotoDto {
  const resolved = applyExploreLabelOverride(item);
  return {
    id: resolved.id,
    name: resolved.name,
    primaryLabel: resolved.primaryLabel,
    thumb: exploreThumbUrl(resolved.id, 560),
    full: exploreFullUrl(resolved.id),
  };
}

export function explorePhotoSaveMeta(item: ExplorePhotoDto) {
  return {
    slug: explorePhotoSlug(item.id),
    title: item.primaryLabel,
    image: item.thumb,
    locationLabel: item.primaryLabel,
    source: 'explore-photo',
  };
}
