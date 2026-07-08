'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { authService } from '@/services/authService';
import {
  createExperienceBlog,
  createFeaturedCategory,
  deleteExperienceBlog,
  deleteFeaturedCategory,
  fetchAdminExperienceBlogs,
  fetchAdminFeaturedCategories,
  patchExperienceBlog,
  patchFeaturedCategory,
} from '@/lib/experienceBlogApi';
import type { ExperienceBlogRecord, FeaturedActivity, FeaturedCategory } from '@/types/experienceBlog';

type Tab = 'categories' | 'blogs';

const emptyCategory = (): FeaturedCategory => ({
  slug: '',
  title: '',
  description: '',
  coverImage: '/krtiv/hero-image.jpeg',
  exploreHref: '/explore',
  activities: [],
  published: true,
  sortOrder: 0,
});

const emptyBlog = (): ExperienceBlogRecord & { published?: boolean } => ({
  slug: '',
  title: '',
  subtitle: '',
  heroImage: '/krtiv/hero-image.jpeg',
  overview: '',
  whyVisit: '',
  bestTimeToVisit: '',
  howToReach: '',
  travelTips: [],
  thingsToDo: [],
  nearbyAttractions: [],
  gallery: [],
  relatedSlugs: [],
  categoryTags: [],
  published: true,
  sortOrder: 0,
  seo: { title: '', description: '', keywords: '' },
});

function linesToList(s: string) {
  return s
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function listToLines(list?: string[]) {
  return (list || []).join('\n');
}

export default function AdminFeaturedExperiencesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('categories');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [blogs, setBlogs] = useState<ExperienceBlogRecord[]>([]);
  const [catEdit, setCatEdit] = useState<FeaturedCategory | null>(null);
  const [blogEdit, setBlogEdit] = useState<(ExperienceBlogRecord & { published?: boolean }) | null>(
    null
  );
  const [tipsText, setTipsText] = useState('');
  const [thingsText, setThingsText] = useState('');
  const [relatedText, setRelatedText] = useState('');
  const [tagsText, setTagsText] = useState('');

  const token = useMemo(() => authService.getCurrentUser()?.token || '', []);

  const reload = async () => {
    const user = authService.getCurrentUser();
    if (!user?.token) return;
    const [c, b] = await Promise.all([
      fetchAdminFeaturedCategories(user.token),
      fetchAdminExperienceBlogs(user.token),
    ]);
    setCategories(c);
    setBlogs(b);
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user?.token || !authService.isContentEditor()) {
      router.replace('/admin/login?next=/admin/featured-experiences');
      return;
    }
    reload()
      .then(() => setReady(true))
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load');
        setReady(true);
      });
  }, [router, token]);

  const startNewCategory = () => {
    setCatEdit(emptyCategory());
    setBlogEdit(null);
    setError('');
  };

  const startEditCategory = (c: FeaturedCategory) => {
    setCatEdit({ ...c, activities: [...(c.activities || [])] });
    setBlogEdit(null);
    setError('');
  };

  const startNewBlog = () => {
    const b = emptyBlog();
    setBlogEdit(b);
    setCatEdit(null);
    setTipsText('');
    setThingsText('');
    setRelatedText('');
    setTagsText('');
    setError('');
  };

  const startEditBlog = (b: ExperienceBlogRecord) => {
    setBlogEdit({ ...b });
    setCatEdit(null);
    setTipsText(listToLines(b.travelTips));
    setThingsText((b.thingsToDo || []).map((t) => t.label).join('\n'));
    setRelatedText((b.relatedSlugs || []).join(', '));
    setTagsText((b.categoryTags || []).join(', '));
    setError('');
  };

  const saveCategory = async () => {
    const user = authService.getCurrentUser();
    if (!user?.token || !catEdit) return;
    if (!catEdit.slug?.trim() || !catEdit.title?.trim()) {
      setError('Category slug and title are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...catEdit,
        slug: catEdit.slug.trim(),
        activities: (catEdit.activities || []).map((a, i) => ({ ...a, sortOrder: i })),
      };
      const original = categories.find(
        (c) => (catEdit._id && c._id === catEdit._id) || c.slug === catEdit.slug
      );
      if (original) {
        await patchFeaturedCategory(user.token, original.slug, payload);
      } else {
        await createFeaturedCategory(user.token, payload);
      }
      setCatEdit(null);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (slug: string) => {
    if (!confirm(`Delete category "${slug}"?`)) return;
    const user = authService.getCurrentUser();
    if (!user?.token) return;
    try {
      await deleteFeaturedCategory(user.token, slug);
      if (catEdit?.slug === slug) setCatEdit(null);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const saveBlog = async () => {
    const user = authService.getCurrentUser();
    if (!user?.token || !blogEdit) return;
    if (!blogEdit.slug?.trim() || !blogEdit.title?.trim()) {
      setError('Blog slug and title are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...blogEdit,
        slug: blogEdit.slug.trim(),
        travelTips: linesToList(tipsText),
        thingsToDo: linesToList(thingsText).map((label) => ({ label, detail: '' })),
        relatedSlugs: relatedText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        categoryTags: tagsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const original = blogs.find(
        (b) => (blogEdit as ExperienceBlogRecord & { _id?: string })._id
          ? (b as ExperienceBlogRecord & { _id?: string })._id ===
            (blogEdit as ExperienceBlogRecord & { _id?: string })._id
          : b.slug === blogEdit.slug
      );
      if (original) {
        await patchExperienceBlog(user.token, original.slug, payload);
      } else {
        await createExperienceBlog(user.token, payload);
      }
      setBlogEdit(null);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const removeBlog = async (slug: string) => {
    if (!confirm(`Delete blog "${slug}"?`)) return;
    const user = authService.getCurrentUser();
    if (!user?.token) return;
    try {
      await deleteExperienceBlog(user.token, slug);
      if (blogEdit?.slug === slug) setBlogEdit(null);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const updateActivity = (index: number, patch: Partial<FeaturedActivity>) => {
    if (!catEdit) return;
    const activities = [...(catEdit.activities || [])];
    activities[index] = { ...activities[index], ...patch };
    setCatEdit({ ...catEdit, activities });
  };

  const addActivity = () => {
    if (!catEdit) return;
    setCatEdit({
      ...catEdit,
      activities: [...(catEdit.activities || []), { title: '', blogSlug: '', sortOrder: 0 }],
    });
  };

  const removeActivity = (index: number) => {
    if (!catEdit) return;
    const activities = [...(catEdit.activities || [])];
    activities.splice(index, 1);
    setCatEdit({ ...catEdit, activities });
  };

  if (!ready) {
    return (
      <AdminShell title="Featured Experiences" eyebrow="Content">
        <p className="text-sm text-[color:var(--ink-soft)]">Loading…</p>
      </AdminShell>
    );
  }

  return (
    <>
      <AdminShell title="Featured Experiences" eyebrow="Content">
        <p className="text-sm text-[color:var(--ink-soft)] mb-6 max-w-2xl">
          Manage homepage curated categories and destination blog pages at{' '}
          <code className="text-xs">/blog/[slug]</code>. Unpublished items are hidden on the public site.
        </p>

        <div className="flex gap-2 mb-6">
          {(['categories', 'blogs'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                tab === t
                  ? 'bg-[color:var(--ink)] text-white border-transparent'
                  : 'bg-white border hairline'
              }`}
            >
              {t === 'categories' ? 'Categories' : 'Blog pages'}
            </button>
          ))}
        </div>

        {error ? <p className="text-red-700 text-sm mb-4">{error}</p> : null}

        {tab === 'categories' ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Categories ({categories.length})</h2>
                <button
                  type="button"
                  onClick={startNewCategory}
                  className="text-sm px-3 py-1.5 rounded-lg bg-[color:var(--saffron)] text-white"
                >
                  New
                </button>
              </div>
              <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {categories.map((c) => (
                  <li
                    key={c.slug}
                    className="flex items-center gap-2 bg-white border hairline rounded-xl p-3 text-sm"
                  >
                    <button
                      type="button"
                      className="flex-1 text-left"
                      onClick={() => startEditCategory(c)}
                    >
                      <span className="font-medium block">{c.title}</span>
                      <span className="text-[color:var(--ink-soft)] text-xs">
                        {c.slug} · {c.published === false ? 'draft' : 'live'} ·{' '}
                        {c.activities?.length || 0} activities
                      </span>
                    </button>
                    <button
                      type="button"
                      className="text-red-600 text-xs px-2"
                      onClick={() => void removeCategory(c.slug)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border hairline rounded-2xl p-5">
              {catEdit ? (
                <div className="space-y-3 text-sm">
                  <h2 className="font-semibold text-base mb-2">
                    {categories.some((c) => c.slug === catEdit.slug) ? 'Edit' : 'New'} category
                  </h2>
                  <label className="block">
                    Slug
                    <input
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={catEdit.slug}
                      onChange={(e) => setCatEdit({ ...catEdit, slug: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    Title
                    <input
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={catEdit.title}
                      onChange={(e) => setCatEdit({ ...catEdit, title: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    Description
                    <textarea
                      className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[72px]"
                      value={catEdit.description || ''}
                      onChange={(e) => setCatEdit({ ...catEdit, description: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    Cover image URL
                    <input
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={catEdit.coverImage || ''}
                      onChange={(e) => setCatEdit({ ...catEdit, coverImage: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    Explore All link
                    <input
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={catEdit.exploreHref || ''}
                      onChange={(e) => setCatEdit({ ...catEdit, exploreHref: e.target.value })}
                    />
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={catEdit.published !== false}
                        onChange={(e) => setCatEdit({ ...catEdit, published: e.target.checked })}
                      />
                      Published
                    </label>
                    <label className="block flex-1">
                      Sort order
                      <input
                        type="number"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={catEdit.sortOrder ?? 0}
                        onChange={(e) =>
                          setCatEdit({ ...catEdit, sortOrder: Number(e.target.value) })
                        }
                      />
                    </label>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Activities</span>
                      <button type="button" className="text-xs underline" onClick={addActivity}>
                        Add activity
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {(catEdit.activities || []).map((act, i) => (
                        <li key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                          <input
                            placeholder="Title"
                            className="border rounded-lg px-2 py-1.5"
                            value={act.title}
                            onChange={(e) => updateActivity(i, { title: e.target.value })}
                          />
                          <input
                            placeholder="blog-slug"
                            className="border rounded-lg px-2 py-1.5"
                            value={act.blogSlug}
                            onChange={(e) => updateActivity(i, { blogSlug: e.target.value })}
                          />
                          <button type="button" onClick={() => removeActivity(i)} aria-label="Remove">
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void saveCategory()}
                      className="px-4 py-2 rounded-xl bg-[color:var(--ink)] text-white text-sm disabled:opacity-50"
                    >
                      {saving ? 'Saving…' : 'Save category'}
                    </button>
                    <button type="button" className="px-4 py-2 text-sm" onClick={() => setCatEdit(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[color:var(--ink-soft)]">Select a category or create a new one.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Blogs ({blogs.length})</h2>
                <button
                  type="button"
                  onClick={startNewBlog}
                  className="text-sm px-3 py-1.5 rounded-lg bg-[color:var(--saffron)] text-white"
                >
                  New
                </button>
              </div>
              <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {blogs.map((b) => (
                  <li
                    key={b.slug}
                    className="flex items-center gap-2 bg-white border hairline rounded-xl p-3 text-sm"
                  >
                    <button type="button" className="flex-1 text-left" onClick={() => startEditBlog(b)}>
                      <span className="font-medium block">{b.title}</span>
                      <span className="text-[color:var(--ink-soft)] text-xs">
                        /blog/{b.slug} · {b.published === false ? 'draft' : 'live'}
                      </span>
                    </button>
                    <Link
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      className="text-xs underline"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      className="text-red-600 text-xs px-2"
                      onClick={() => void removeBlog(b.slug)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border hairline rounded-2xl p-5 max-h-[85vh] overflow-y-auto">
              {blogEdit ? (
                <div className="space-y-3 text-sm">
                  <h2 className="font-semibold text-base mb-2">
                    {blogs.some((b) => b.slug === blogEdit.slug) ? 'Edit' : 'New'} blog
                  </h2>
                  <label className="block">
                    Slug
                    <input
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={blogEdit.slug}
                      onChange={(e) => setBlogEdit({ ...blogEdit, slug: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    Title
                    <input
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={blogEdit.title}
                      onChange={(e) => setBlogEdit({ ...blogEdit, title: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    Subtitle / region
                    <input
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={blogEdit.subtitle || ''}
                      onChange={(e) => setBlogEdit({ ...blogEdit, subtitle: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    Hero image URL
                    <input
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={blogEdit.heroImage || ''}
                      onChange={(e) => setBlogEdit({ ...blogEdit, heroImage: e.target.value })}
                    />
                  </label>
                  {(
                    [
                      ['overview', 'Overview'],
                      ['whyVisit', 'Why visit'],
                      ['bestTimeToVisit', 'Best time to visit'],
                      ['howToReach', 'How to reach'],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="block">
                      {label}
                      <textarea
                        className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[64px]"
                        value={(blogEdit[key] as string) || ''}
                        onChange={(e) => setBlogEdit({ ...blogEdit, [key]: e.target.value })}
                      />
                    </label>
                  ))}
                  <label className="block">
                    Things to do (one per line)
                    <textarea
                      className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[80px]"
                      value={thingsText}
                      onChange={(e) => setThingsText(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    Travel tips (one per line)
                    <textarea
                      className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[80px]"
                      value={tipsText}
                      onChange={(e) => setTipsText(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    Related slugs (comma-separated)
                    <input
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={relatedText}
                      onChange={(e) => setRelatedText(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    Category tags (comma-separated, for auto-related)
                    <input
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={tagsText}
                      onChange={(e) => setTagsText(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    Gallery URLs (comma-separated)
                    <input
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={(blogEdit.gallery || []).join(', ')}
                      onChange={(e) =>
                        setBlogEdit({
                          ...blogEdit,
                          gallery: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="block">
                      Map lat
                      <input
                        type="number"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={blogEdit.map?.lat ?? ''}
                        onChange={(e) =>
                          setBlogEdit({
                            ...blogEdit,
                            map: {
                              ...blogEdit.map,
                              lat: e.target.value === '' ? undefined : Number(e.target.value),
                            },
                          })
                        }
                      />
                    </label>
                    <label className="block">
                      Map lng
                      <input
                        type="number"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={blogEdit.map?.lng ?? ''}
                        onChange={(e) =>
                          setBlogEdit({
                            ...blogEdit,
                            map: {
                              ...blogEdit.map,
                              lng: e.target.value === '' ? undefined : Number(e.target.value),
                            },
                          })
                        }
                      />
                    </label>
                    <label className="flex items-end pb-2">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={blogEdit.published !== false}
                        onChange={(e) => setBlogEdit({ ...blogEdit, published: e.target.checked })}
                      />
                      Published
                    </label>
                  </div>
                  <fieldset className="border rounded-xl p-3 space-y-2">
                    <legend className="px-1 text-xs font-medium">SEO</legend>
                    <input
                      placeholder="Meta title"
                      className="w-full border rounded-lg px-3 py-2"
                      value={blogEdit.seo?.title || ''}
                      onChange={(e) =>
                        setBlogEdit({
                          ...blogEdit,
                          seo: { ...blogEdit.seo, title: e.target.value },
                        })
                      }
                    />
                    <textarea
                      placeholder="Meta description"
                      className="w-full border rounded-lg px-3 py-2 min-h-[56px]"
                      value={blogEdit.seo?.description || ''}
                      onChange={(e) =>
                        setBlogEdit({
                          ...blogEdit,
                          seo: { ...blogEdit.seo, description: e.target.value },
                        })
                      }
                    />
                  </fieldset>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void saveBlog()}
                      className="px-4 py-2 rounded-xl bg-[color:var(--ink)] text-white text-sm disabled:opacity-50"
                    >
                      {saving ? 'Saving…' : 'Save blog'}
                    </button>
                    <button type="button" className="px-4 py-2 text-sm" onClick={() => setBlogEdit(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[color:var(--ink-soft)]">Select a blog or create a new one.</p>
              )}
            </div>
          </div>
        )}
      </AdminShell>
      <SiteFooter />
    </>
  );
}
