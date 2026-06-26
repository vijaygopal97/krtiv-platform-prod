import { getApiBase, assetPath } from '@/lib/basePath';
import type { HeroAsset, HeroSlideRecord } from '@/lib/heroSlideTypes';

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchPublicHeroSlides(scope = 'home'): Promise<HeroSlideRecord[]> {
  const res = await fetch(`${getApiBase()}/hero-slides?scope=${encodeURIComponent(scope)}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok || !data.success) return [];
  return data.slides as HeroSlideRecord[];
}

export function trackHeroSlide(slideId: string, event: 'impression' | 'click') {
  if (!slideId) return;
  void fetch(`${getApiBase()}/hero-slides/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slideId, event }),
  }).catch(() => {});
}

export async function fetchAdminHeroSlides(token: string, scope?: string): Promise<HeroSlideRecord[]> {
  const qs = scope ? `?scope=${encodeURIComponent(scope)}` : '';
  const res = await fetch(`${getApiBase()}/admin/hero-slides${qs}`, {
    headers: authHeaders(token),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load slides');
  return data.slides as HeroSlideRecord[];
}

export async function fetchHeroAssets(token: string): Promise<HeroAsset[]> {
  const res = await fetch(`${getApiBase()}/admin/hero-assets`, {
    headers: authHeaders(token),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load assets');
  return data.assets as HeroAsset[];
}

export function resolveSlideImage(url: string) {
  if (url.startsWith('http')) return url;
  return assetPath(url);
}

export async function createHeroSlide(token: string, slide: Partial<HeroSlideRecord>) {
  const res = await fetch(`${getApiBase()}/admin/hero-slides`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(slide),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Create failed');
  return data.slide as HeroSlideRecord;
}

export async function updateHeroSlide(token: string, id: string, slide: Partial<HeroSlideRecord>) {
  const res = await fetch(`${getApiBase()}/admin/hero-slides/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(slide),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data.slide as HeroSlideRecord;
}

export async function deleteHeroSlide(token: string, id: string) {
  const res = await fetch(`${getApiBase()}/admin/hero-slides/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Delete failed');
}

export async function uploadHeroImage(token: string, file: File) {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${getApiBase()}/admin/hero-slides/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data as { imageUrl: string; label: string };
}
