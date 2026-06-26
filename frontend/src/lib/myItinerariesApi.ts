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
}): Promise<SavedItineraryRecord | null> {
  const base = getApiBase().replace(/\/$/, '');
  const res = await fetch(`${base}/my/itineraries`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.item ?? null;
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
