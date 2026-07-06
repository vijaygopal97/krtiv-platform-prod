import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { JourneyMagazinePage } from '@/components/journeys/JourneyMagazinePage';
import { fetchJourneyBySlug } from '@/lib/journeyApi';
import { JOURNEY_SLUGS } from '@/types/journey';

type Props = { params: Promise<{ slug: string }> };

/** Avoid baking a static 404 when the API is unreachable during `next build`. */
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function generateStaticParams() {
  return JOURNEY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { journey } = await fetchJourneyBySlug(slug);
  if (!journey) return { title: 'Journey — Maharashtra Tourism' };
  const seo = journey.seo;
  return {
    title: seo?.title || `${journey.title} — Maharashtra Tourism`,
    description: seo?.description || journey.shortDescription,
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.title || journey.title,
      description: seo?.description || journey.shortDescription,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : journey.heroImage ? [{ url: journey.heroImage }] : [],
    },
  };
}

export default async function JourneyDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!JOURNEY_SLUGS.includes(slug as (typeof JOURNEY_SLUGS)[number])) {
    notFound();
  }
  const { journey, related } = await fetchJourneyBySlug(slug);
  if (!journey) notFound();

  return <JourneyMagazinePage journey={journey} related={related} />;
}
