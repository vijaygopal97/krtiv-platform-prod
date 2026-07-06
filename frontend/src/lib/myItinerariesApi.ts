import { getApiBase } from '@/lib/basePath';
import { authService } from '@/services/authService';

function authHeaders(): HeadersInit {
  const user = authService.getCurrentUser();
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (user?.token) h.Authorization = `Bearer ${user.token}`;
  return h;
}

export interface SavedItineraryRecord {
  _id: string;
  title: string;
  categoryFocus?: string;
  categorySlug?: string;
  keywords?: string[];
  itineraryText: string;
  parsedSummary?: { theme?: string; region?: string; dayCount?: number };
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
  source?: 'smart-keywords' | 'dashboard' | 'import';
}

export async function fetchMyItineraries(favoritesOnly = false): Promise<SavedItineraryRecord[]> {
  const base = getApiBase().replace(/\/$/, '');
  const qs = favoritesOnly ? '?favorites=1' : '';
  const res = await fetch(`${base}/my/itineraries${qs}`, { headers: authHeaders(), cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.items) ? data.items : [];
}

export async function saveItinerary(payload: {
  title: string;
  itineraryText: string;
  keywords?: string[];
  categoryFocus?: string;
  categorySlug?: string;
  parsedSummary?: SavedItineraryRecord['parsedSummary'];
  isFavorite?: boolean;
  jobId?: string;
  source?: 'smart-keywords' | 'dashboard';
}): Promise<{ item: SavedItineraryRecord | null; error?: string }> {
  const base = getApiBase().replace(/\/$/, '');
  const user = authService.getCurrentUser();
  if (!user?.token) {
    return { item: null, error: 'Please sign in to save itineraries.' };
  }
  let res: Response;
  try {
    res = await fetch(`${base}/my/itineraries`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
  } catch {
    return { item: null, error: 'Network error. Check your connection and try again.' };
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      return { item: null, error: 'Session expired. Log out and sign in again.' };
    }
    const msg = typeof data.message === 'string' ? data.message : `Save failed (${res.status}).`;
    return { item: null, error: msg };
  }
  const data = await res.json();
  return { item: data.item ?? null, error: data.item ? undefined : 'Save failed.' };
}

export async function toggleFavoriteItinerary(id: string, isFavorite: boolean): Promise<boolean> {
  const base = getApiBase().replace(/\/$/, '');
  const res = await fetch(`${base}/my/itineraries/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ isFavorite }),
  });
  return res.ok;
}

export async function deleteItinerary(id: string): Promise<boolean> {
  const base = getApiBase().replace(/\/$/, '');
  const res = await fetch(`${base}/my/itineraries/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res.ok;
}
