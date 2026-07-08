import type { NextRequest } from 'next/server';
import catalog from '@/data/exploreCatalog.generated.json';
import { toExplorePhotoDto, type ExploreCatalog } from '@/lib/explorePhotos';

const DATA = catalog as ExploreCatalog;

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const tag = searchParams.get('tag') || 'all';
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const cursor = Math.max(0, Number.parseInt(searchParams.get('cursor') || '0', 10) || 0);
  const limit = Math.min(60, Math.max(12, Number.parseInt(searchParams.get('limit') || '30', 10) || 30));

  let pool = DATA.items;
  if (tag !== 'all') {
    pool = pool.filter((item) => item.tags.some((t) => t.slug === tag));
  }
  if (q) {
    pool = pool.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q) ||
        item.primaryLabel.toLowerCase().includes(q) ||
        item.tags.some((t) => t.label.toLowerCase().includes(q)),
    );
  }

  const slice = pool.slice(cursor, cursor + limit);
  const nextCursor = cursor + limit < pool.length ? cursor + limit : null;

  return Response.json(
    {
      items: slice.map(toExplorePhotoDto),
      nextCursor,
      total: pool.length,
      catalogTotal: DATA.total,
      tags: DATA.tags,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
