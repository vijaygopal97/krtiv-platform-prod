"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SiteFooter } from "@/components/krtiv/SiteFooter";
import { authService } from "@/services/authService";
import {
  createHeroSlide,
  deleteHeroSlide,
  fetchAdminHeroSlides,
  fetchHeroAssets,
  resolveSlideImage,
  updateHeroSlide,
  uploadHeroImage,
} from "@/lib/heroSlidesApi";
import type { HeroAsset, HeroSlideRecord } from "@/lib/heroSlideTypes";
import { HERO_SCOPES } from "@/data/heroSlidesData";

const emptyForm = (scope = "home"): Partial<HeroSlideRecord> => ({
  imageUrl: "/krtiv/hero-image.jpeg",
  alt: "",
  focalX: 50,
  focalY: 50,
  kicker: "",
  title: "",
  description: "",
  scope,
  sortOrder: 0,
  active: true,
});

export default function AdminHeroPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [scope, setScope] = useState("home");
  const [slides, setSlides] = useState<HeroSlideRecord[]>([]);
  const [assets, setAssets] = useState<HeroAsset[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<HeroSlideRecord>>(emptyForm());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token = useMemo(() => authService.getCurrentUser()?.token || "", []);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user?.token || user.role !== "admin") {
      router.replace("/login?next=/admin/hero");
      return;
    }
    Promise.all([fetchAdminHeroSlides(user.token, scope), fetchHeroAssets(user.token)])
      .then(([s, a]) => {
        setSlides(s);
        setAssets(a);
        setReady(true);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load admin data");
        setReady(true);
      });
  }, [router, token, scope]);

  const reload = async () => {
    const user = authService.getCurrentUser();
    if (!user?.token) return;
    const [s, a] = await Promise.all([
      fetchAdminHeroSlides(user.token, scope),
      fetchHeroAssets(user.token),
    ]);
    setSlides(s);
    setAssets(a);
  };

  const startEdit = (slide: HeroSlideRecord) => {
    setEditingId(slide._id || null);
    setForm({ ...slide });
    setError("");
  };

  const startCreate = () => {
    setEditingId("new");
    setForm({ ...emptyForm(scope), sortOrder: slides.length });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm(scope));
  };

  const save = async () => {
    const user = authService.getCurrentUser();
    if (!user?.token) return;
    if (!form.imageUrl || !form.title) {
      setError("Image and title are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, scope: form.scope || scope };
      if (editingId === "new") {
        await createHeroSlide(user.token, payload);
      } else if (editingId) {
        await updateHeroSlide(user.token, editingId, payload);
      }
      cancelEdit();
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this hero slide?")) return;
    const user = authService.getCurrentUser();
    if (!user?.token) return;
    try {
      await deleteHeroSlide(user.token, id);
      if (editingId === id) cancelEdit();
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const onUpload = async (file: File | null) => {
    if (!file) return;
    const user = authService.getCurrentUser();
    if (!user?.token) return;
    setUploading(true);
    setError("");
    try {
      const res = await uploadHeroImage(user.token, file);
      setForm((f) => ({ ...f, imageUrl: res.imageUrl, alt: f.alt || res.label }));
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!ready) {
    return (
      <main className="min-h-screen bg-[color:var(--ivory)] pt-20 md:pt-24 grid place-items-center">
        <p className="text-[color:var(--ink-soft)]">Loading admin…</p>
      </main>
    );
  }

  return (
    <>
    <AdminShell title="Hero CMS">
      <div className="max-w-[1200px]">
        <p className="lede mb-10 max-w-2xl text-[color:var(--ink-soft)]">
          Manage homepage and category hero background slides. Hero copy stays fixed on each page — only the background image and bottom slide label rotate.
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-[color:var(--ink-soft)]">
              Page
              <select
                className="ml-2 rounded-full border hairline px-4 py-2 bg-white text-[color:var(--ink)]"
                value={scope}
                onChange={(e) => {
                  setScope(e.target.value);
                  cancelEdit();
                }}
              >
                {HERO_SCOPES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <button
            type="button"
            onClick={startCreate}
            className="h-11 px-5 rounded-full bg-[color:var(--ink)] text-white text-sm hover:opacity-90"
          >
            Add slide
          </button>
          </div>
        </div>

        {error && (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
            {error}
          </p>
        )}

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            {editingId ? (
              <div className="rounded-2xl border hairline bg-white p-6 shadow-sm lg:sticky lg:top-28">
                <h2 className="font-display text-xl mb-4">
                  {editingId === "new" ? "New slide" : "Edit slide"}
                </h2>
                <div className="space-y-4">
                  <label className="block text-sm">
                    <span className="text-[color:var(--ink-soft)]">Slide label (bottom kicker)</span>
                    <input
                      className="mt-1 w-full rounded-xl border hairline px-3 py-2"
                      value={form.kicker || ""}
                      onChange={(e) => setForm({ ...form, kicker: e.target.value })}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-[color:var(--ink-soft)]">Internal name (admin only)</span>
                    <input
                      className="mt-1 w-full rounded-xl border hairline px-3 py-2"
                      value={form.title || ""}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-[color:var(--ink-soft)]">Image path</span>
                    <input
                      className="mt-1 w-full rounded-xl border hairline px-3 py-2 font-mono text-xs"
                      value={form.imageUrl || ""}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm">
                      <span className="text-[color:var(--ink-soft)]">Focal X %</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="mt-1 w-full rounded-xl border hairline px-3 py-2"
                        value={form.focalX ?? 50}
                        onChange={(e) => setForm({ ...form, focalX: Number(e.target.value) })}
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="text-[color:var(--ink-soft)]">Focal Y %</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="mt-1 w-full rounded-xl border hairline px-3 py-2"
                        value={form.focalY ?? 50}
                        onChange={(e) => setForm({ ...form, focalY: Number(e.target.value) })}
                      />
                    </label>
                  </div>
                  <label className="block text-sm">
                    <span className="text-[color:var(--ink-soft)]">Alt text</span>
                    <input
                      className="mt-1 w-full rounded-xl border hairline px-3 py-2"
                      value={form.alt || ""}
                      onChange={(e) => setForm({ ...form, alt: e.target.value })}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-[color:var(--ink-soft)]">Sort order</span>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-xl border hairline px-3 py-2"
                      value={form.sortOrder ?? 0}
                      onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    />
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.active !== false}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    />
                    Active on {HERO_SCOPES.find((s) => s.id === scope)?.label || "page"}
                  </label>

                  {form.imageUrl && (
                    <img
                      src={resolveSlideImage(form.imageUrl)}
                      alt=""
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  )}

                  <label className="block text-sm">
                    <span className="text-[color:var(--ink-soft)]">Upload new image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-1 block w-full text-sm"
                      disabled={uploading}
                      onChange={(e) => onUpload(e.target.files?.[0] || null)}
                    />
                  </label>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={save}
                      disabled={saving}
                      className="flex-1 h-11 rounded-full bg-[color:var(--saffron)] text-[color:var(--ink)] text-sm font-medium disabled:opacity-50"
                    >
                      {saving ? "Saving…" : "Save slide"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="h-11 px-4 rounded-full border hairline text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[color:var(--ink-soft)] text-sm">
                Select a slide to edit, or add a new one. Pick images from the gallery or upload a new file.
              </p>
            )}
          </div>

          <div className="lg:col-span-7 space-y-6">
            <section>
              <h2 className="font-display text-xl mb-4">Current slides</h2>
              <div className="space-y-3">
                {slides.map((slide) => (
                  <div
                    key={slide._id}
                    className="flex gap-4 rounded-2xl border hairline bg-white p-4 items-center"
                  >
                    <img
                      src={resolveSlideImage(slide.imageUrl)}
                      alt=""
                      className="w-24 h-16 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{slide.kicker || slide.title}</p>
                      <p className="text-xs text-[color:var(--ink-soft)] truncate">
                        {slide.title} · order {slide.sortOrder}
                        {!slide.active ? " · hidden" : ""}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(slide)}
                        className="text-sm px-3 py-1.5 rounded-full border hairline hover:bg-[color:var(--bone)]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => slide._id && remove(slide._id)}
                        className="text-sm px-3 py-1.5 rounded-full border border-red-200 text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl mb-4">Image gallery</h2>
              <p className="text-sm text-[color:var(--ink-soft)] mb-4">
                Click an image to use it in the form above.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {assets.map((asset) => (
                  <button
                    key={asset.url}
                    type="button"
                    onClick={() => {
                      if (!editingId) startCreate();
                      setForm((f) => ({ ...f, imageUrl: asset.url }));
                    }}
                    className={`rounded-xl overflow-hidden border-2 text-left transition ${
                      form.imageUrl === asset.url
                        ? "border-[color:var(--saffron)]"
                        : "border-transparent hover:border-[color:var(--hairline)]"
                    }`}
                  >
                    <img
                      src={resolveSlideImage(asset.url)}
                      alt=""
                      className="w-full h-24 object-cover"
                    />
                    <span className="block px-2 py-1 text-[10px] truncate text-[color:var(--ink-soft)]">
                      {asset.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        <p className="mt-12 text-sm text-[color:var(--ink-soft)]">
          <Link href="/" className="underline hover:text-[color:var(--ink)]">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </AdminShell>
      <SiteFooter />
    </>
  );
}
