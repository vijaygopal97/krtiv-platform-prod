import { NextResponse } from 'next/server';
import { allDestinationSlugs } from '@/data/destinations';
import { resolveDestinationGallery } from '@/lib/server/destinationGalleryService';
import { resolveDestinationSlug } from '@/lib/destinationRedirects';

type Params = { params: Promise<{ slug: string }> };

const ALLOWED = new Set(allDestinationSlugs());

export async function GET(_req: Request, { params }: Params) {
  const { slug: raw } = await params;
  const slug = resolveDestinationSlug(raw);
  if (!ALLOWED.has(slug)) {
    return NextResponse.json({ error: 'Unknown destination' }, { status: 404 });
  }

  const images = await resolveDestinationGallery(slug);
  return NextResponse.json(
    { slug, images },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  );
}
