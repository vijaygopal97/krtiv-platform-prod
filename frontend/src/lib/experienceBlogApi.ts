import { getApiBase } from '@/lib/basePath';
import type { ExperienceBlogListItem, ExperienceBlogRecord, FeaturedCategory } from '@/types/experienceBlog';

function serverApiBases(): string[] {
  const internal = (process.env.INTERNAL_API_URL || 'http://127.0.0.1:5001/api').replace(/\/$/, '');
  let publicRoot = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
  if (publicRoot.endsWith('/api')) publicRoot = publicRoot.slice(0, -4);
  const publicApi = publicRoot ? `${publicRoot}/api` : '';
  const bases = [internal];
  if (publicApi && publicApi !== internal) bases.push(publicApi);
  return bases;
}

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export async function fetchFeaturedCategories(): Promise<FeaturedCategory[]> {
  const init: RequestInit =
    typeof window === 'undefined' ? { next: { revalidate: 60 } } : { cache: 'no-store' };
  const bases =
    typeof window === 'undefined' ? serverApiBases() : [getApiBase().replace(/\/$/, '')];

  for (const base of bases) {
    const { res, data } = await fetchJson(`${base}/featured-experiences`, init);
    if (res.ok && data.success) return data.categories as FeaturedCategory[];
  }
  return [];
}

export async function fetchExperienceBlogBySlug(slug: string): Promise<{
  blog: ExperienceBlogRecord | null;
  related: ExperienceBlogListItem[];
}> {
  const init: RequestInit =
    typeof window === 'undefined' ? { next: { revalidate: 60 } } : { cache: 'no-store' };
  const bases =
    typeof window === 'undefined' ? serverApiBases() : [getApiBase().replace(/\/$/, '')];

  for (const base of bases) {
    const { res, data } = await fetchJson(`${base}/experience-blogs/${encodeURIComponent(slug)}`, init);
    if (res.ok && data.success && data.blog) {
      return {
        blog: data.blog as ExperienceBlogRecord,
        related: (data.related as ExperienceBlogListItem[]) || [],
      };
    }
  }
  return { blog: null, related: [] };
}

export async function fetchAllExperienceBlogSlugs(): Promise<string[]> {
  const init: RequestInit =
    typeof window === 'undefined' ? { next: { revalidate: 300 } } : { cache: 'no-store' };
  const bases =
    typeof window === 'undefined' ? serverApiBases() : [getApiBase().replace(/\/$/, '')];

  for (const base of bases) {
    const { res, data } = await fetchJson(`${base}/experience-blogs`, init);
    if (res.ok && data.success) {
      return (data.blogs as ExperienceBlogListItem[]).map((b) => b.slug);
    }
  }
  return [];
}

const adminBase = () => getApiBase().replace(/\/$/, '');

export async function fetchAdminFeaturedCategories(token: string) {
  const res = await fetch(`${adminBase()}/admin/featured-categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load categories');
  return data.categories as FeaturedCategory[];
}

export async function fetchAdminExperienceBlogs(token: string) {
  const res = await fetch(`${adminBase()}/admin/experience-blogs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load blogs');
  return data.blogs as ExperienceBlogRecord[];
}

export async function patchFeaturedCategory(
  token: string,
  slug: string,
  body: Partial<FeaturedCategory>
) {
  const res = await fetch(`${adminBase()}/admin/featured-categories/${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data.category as FeaturedCategory;
}

export async function patchExperienceBlog(
  token: string,
  slug: string,
  body: Partial<ExperienceBlogRecord>
) {
  const res = await fetch(`${adminBase()}/admin/experience-blogs/${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data.blog as ExperienceBlogRecord;
}

export async function createFeaturedCategory(token: string, body: FeaturedCategory) {
  const res = await fetch(`${adminBase()}/admin/featured-categories`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Create failed');
  return data.category as FeaturedCategory;
}

export async function deleteFeaturedCategory(token: string, slug: string) {
  const res = await fetch(`${adminBase()}/admin/featured-categories/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Delete failed');
}

export async function createExperienceBlog(token: string, body: ExperienceBlogRecord & { published?: boolean }) {
  const res = await fetch(`${adminBase()}/admin/experience-blogs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Create failed');
  return data.blog as ExperienceBlogRecord;
}

export async function deleteExperienceBlog(token: string, slug: string) {
  const res = await fetch(`${adminBase()}/admin/experience-blogs/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Delete failed');
}
