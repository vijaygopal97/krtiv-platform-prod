import { getApiBase } from '@/lib/basePath';
import { authService } from '@/services/authService';

export type ContentEntry = {
  value: string;
  valueType?: string;
  page?: string;
  section?: string;
  key?: string;
  updatedAt?: string;
};

export type ContentMap = Record<string, ContentEntry>;

export type ContentHistoryRow = {
  _id: string;
  cmsKey: string;
  previousValue: string;
  newValue: string;
  editedByEmail?: string;
  createdAt: string;
  editedBy?: { name?: string; email?: string };
};

function authHeaders(): HeadersInit {
  const token = authService.getCurrentUser()?.token;
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export const contentService = {
  async fetchPublicContent(page?: string): Promise<ContentMap> {
    const qs = page ? `?page=${encodeURIComponent(page)}` : '';
    const res = await fetch(`${getApiBase()}/content${qs}`, { credentials: 'same-origin' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return {};
    return (data.content as ContentMap) || {};
  },

  async saveField(payload: {
    cmsKey: string;
    value: string;
    valueType?: string;
    page?: string;
    section?: string;
    key?: string;
  }): Promise<{ success: boolean; unchanged?: boolean }> {
    const res = await fetch(`${getApiBase()}/admin/content`, {
      method: 'PATCH',
      headers: authHeaders(),
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Save failed');
    return data;
  },

  async fetchHistory(cmsKey?: string): Promise<ContentHistoryRow[]> {
    const qs = cmsKey ? `?cmsKey=${encodeURIComponent(cmsKey)}` : '';
    const res = await fetch(`${getApiBase()}/admin/content/history${qs}`, {
      headers: authHeaders(),
      credentials: 'same-origin',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Could not load history');
    return (data.history as ContentHistoryRow[]) || [];
  },

  async rollback(historyId: string): Promise<void> {
    const res = await fetch(`${getApiBase()}/admin/content/rollback`, {
      method: 'POST',
      headers: authHeaders(),
      credentials: 'same-origin',
      body: JSON.stringify({ historyId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Rollback failed');
  },

  async uploadMedia(file: File): Promise<string> {
    const token = authService.getCurrentUser()?.token;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${getApiBase()}/admin/content/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'same-origin',
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data.url as string;
  },
};
