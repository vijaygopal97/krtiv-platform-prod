import { notFound } from 'next/navigation';
import { CuratedExperienceGuidePage } from '@/components/krtiv/CuratedExperienceGuidePage';
import { allNatureTrailSlugs, getNatureTrail } from '@/data/curatedExperiences';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allNatureTrailSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = getNatureTrail(slug);
  if (!guide) return { title: 'Nature Trails — Maharashtra Tourism' };
  return {
    title: `${guide.title} — Nature Trails — Maharashtra Tourism`,
    description: guide.description,
  };
}

export default async function NatureTrailPage({ params }: Props) {
  const { slug } = await params;
  const guide = getNatureTrail(slug);
  if (!guide) notFound();
  return <CuratedExperienceGuidePage guide={guide} trail="nature-trails" />;
}
