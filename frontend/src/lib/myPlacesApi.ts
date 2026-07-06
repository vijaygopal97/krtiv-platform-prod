import { getApiBase } from '@/lib/basePath';
import { authService } from '@/services/authService';

function authHeaders(): HeadersInit {
  const user = authService.getCurrentUser();
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (user?.token) h.Authorization = `Bearer ${user.token}`;
  return h;
}

export interface SavedPlaceRecord {
  _id?: string;
  slug: string;
  title?: string;
  image?: string;
  locationLabel?: string;
  source?: string;
  lat?: number;
  lng?: number;
  createdAt?: string;
  updatedAt?: string;
}

type ApiResult = { ok: boolean; error?: string };

async function parseError(res: Response): Promise<string> {
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) return 'Session expired. Please sign in again.';
  return typeof data.message === 'string' ? data.message : `Request failed (${res.status}).`;
}

export async function fetchMyPlaces(): Promise<SavedPlaceRecord[]> {
  const user = authService.getCurrentUser();
  if (!user?.token) return [];
  const base = getApiBase().replace(/\/$/, '');
  const res = await fetch(`${base}/my/places`, {
    headers: authHeaders(),
    cache: 'no-store',
    credentials: 'same-origin',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.items) ? data.items : [];
}

export async function upsertMyPlace(place: SavedPlaceRecord): Promise<ApiResult> {
  const user = authService.getCurrentUser();
  if (!user?.token) return { ok: false, error: 'Please sign in to save places.' };
  const base = getApiBase().replace(/\/$/, '');
  const res = await fetch(`${base}/my/places`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'same-origin',
    body: JSON.stringify(place),
  });
  if (!res.ok) return { ok: false, error: await parseError(res) };
  return { ok: true };
}

export async function syncMyPlaces(places: SavedPlaceRecord[]): Promise<SavedPlaceRecord[]> {
  const user = authService.getCurrentUser();
  if (!user?.token) return [];
  const base = getApiBase().replace(/\/$/, '');
  const res = await fetch(`${base}/my/places/sync`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'same-origin',
    body: JSON.stringify({ places }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.items) ? data.items : [];
}

export async function deleteMyPlace(slug: string): Promise<ApiResult> {
  const user = authService.getCurrentUser();
  if (!user?.token) return { ok: false, error: 'Please sign in to manage saved places.' };
  const base = getApiBase().replace(/\/$/, '');
  const res = await fetch(`${base}/my/places/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
    headers: authHeaders(),
    credentials: 'same-origin',
  });
  if (!res.ok) return { ok: false, error: await parseError(res) };
  return { ok: true };
}
