'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { authService } from '@/services/authService';
import { contentService, type ContentHistoryRow } from '@/services/contentService';

export default function AdminContentHistoryPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ContentHistoryRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user?.token || !authService.isContentEditor()) {
      router.replace('/admin/login?next=/admin/content');
      return;
    }
    contentService
      .fetchHistory()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, [router]);

  async function rollback(id: string) {
    await contentService.rollback(id);
    const next = await contentService.fetchHistory();
    setRows(next);
  }

  return (
    <AdminShell title="Inline CMS" eyebrow="Content">
      <p className="text-sm text-[color:var(--ink-soft)] mb-6">
        Version history for inline edits. Roll back any field from the live site or here.
      </p>
      {error ? <p className="text-red-700 text-sm">{error}</p> : null}
      <ul className="space-y-4">
        {rows.map((row) => (
          <li key={row._id} className="bg-white border hairline rounded-xl p-4 text-sm">
            <p className="font-mono text-xs text-[color:var(--ink-soft)]">{row.cmsKey}</p>
            <p className="mt-2 text-xs text-[color:var(--ink-soft)]">
              {new Date(row.createdAt).toLocaleString()} — {row.editedByEmail || 'Admin'}
            </p>
            <p className="mt-2 line-through opacity-60">{row.previousValue.slice(0, 200)}</p>
            <p className="mt-1 font-medium">{row.newValue.slice(0, 200)}</p>
            <button
              type="button"
              className="mt-3 text-[color:var(--saffron)] underline text-xs"
              onClick={() => rollback(row._id)}
            >
              Rollback to previous value
            </button>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
