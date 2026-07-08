import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ExperienceBlogPage } from '@/components/featuredExperiences/ExperienceBlogPage';
import { fetchAllExperienceBlogSlugs, fetchExperienceBlogBySlug } from '@/lib/experienceBlogApi';

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await fetchAllExperienceBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { blog } = await fetchExperienceBlogBySlug(slug);
  if (!blog) return { title: 'Experience — Maharashtra Tourism' };
  const seo = blog.seo;
  return {
    title: seo?.title || `${blog.title} — Maharashtra Tourism`,
    description: seo?.description || blog.overview,
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.title || blog.title,
      description: seo?.description || blog.overview,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : blog.heroImage ? [{ url: blog.heroImage }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const { blog, related } = await fetchExperienceBlogBySlug(slug);
  if (!blog) notFound();

  return <ExperienceBlogPage blog={blog} related={related} />;
}
