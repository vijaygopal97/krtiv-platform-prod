import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ActivityMagazinePage } from '@/components/activities/ActivityMagazinePage';
import {
  CATEGORY_ACTIVITY_SLUGS,
  getActivityBySlug,
  CATEGORY_ACTIVITIES,
} from '@/data/categoryActivities';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return CATEGORY_ACTIVITY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) return { title: 'Activity — Maharashtra Tourism' };
  return {
    title: `${activity.title} — Maharashtra Tourism`,
    description: activity.shortDescription || activity.excerpt,
  };
}

export default async function ActivityDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!CATEGORY_ACTIVITY_SLUGS.includes(slug as (typeof CATEGORY_ACTIVITY_SLUGS)[number])) {
    notFound();
  }
  const activity = getActivityBySlug(slug);
  if (!activity) notFound();

  const related = CATEGORY_ACTIVITIES.filter(
    (a) => a.categoryId === activity.categoryId && a.slug !== activity.slug
  ).slice(0, 3);

  return <ActivityMagazinePage activity={activity} related={related} />;
}
