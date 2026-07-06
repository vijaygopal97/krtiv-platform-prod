'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCms } from '@/components/cms/CmsContext';
import { contentService, type ContentHistoryRow } from '@/services/contentService';

function pageSlugFromPath(pathname: string): string {
  if (pathname === '/' || pathname === '') return 'home';
  const seg = pathname.split('/').filter(Boolean)[0];
  return seg || 'home';
}

const SEO_FIELDS = [
  { key: 'title', label: 'Page title' },
  { key: 'description', label: 'Meta description' },
  { key: 'keywords', label: 'Keywords' },
  { key: 'ogImage', label: 'Open Graph image URL' },
] as const;

export function PageSeoPanel() {
  const { canEdit, editMode, getText, saveField, refreshContent } = useCms();
  const pathname = usePathname() ?? '/';
  const page = useMemo(() => pageSlugFromPath(pathname), [pathname]);
  const [open, setOpen] = useState(false);
  const [historyKey, setHistoryKey] = useState<string | null>(null);
  const [history, setHistory] = useState<ContentHistoryRow[]>([]);

  useEffect(() => {
    if (!open || !historyKey) return;
    contentService.fetchHistory(historyKey).then(setHistory).catch(() => setHistory([]));
  }, [open, historyKey]);

  const loadHistory = useCallback((cmsKey: string) => {
    setHistoryKey(cmsKey);
    setOpen(true);
  }, []);

  const rollback = useCallback(
    async (id: string) => {
      await contentService.rollback(id);
      await refreshContent();
      if (historyKey) {
        const rows = await contentService.fetchHistory(historyKey);
        setHistory(rows);
      }
    },
    [historyKey, refreshContent]
  );

  if (!canEdit || !editMode) return null;

  return (
    <>
      <button type="button" className="cms-seo-fab" onClick={() => setOpen((v) => !v)}>
        SEO
      </button>
      {open ? (
        <div className="cms-seo-panel" role="dialog" aria-label="Page SEO">
          <div className="cms-seo-panel__head">
            <h2 className="cms-seo-panel__title">SEO — {page}</h2>
            <button type="button" className="cms-seo-panel__close" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <div className="cms-seo-panel__body">
            {SEO_FIELDS.map(({ key, label }) => {
              const cmsKey = `${page}.seo.${key}`;
              const fallback = '';
              const value = getText(cmsKey, fallback);
              return (
                <label key={key} className="cms-seo-field">
                  <span>{label}</span>
                  <input
                    type="text"
                    defaultValue={value}
                    onBlur={(e) => {
                      const next = e.target.value.trim();
                      if (next !== value) saveField(cmsKey, next, 'seo');
                    }}
                  />
                  <button type="button" className="cms-seo-history-link" onClick={() => loadHistory(cmsKey)}>
                    History
                  </button>
                </label>
              );
            })}
            {historyKey ? (
              <div className="cms-history">
                <p className="cms-history__key">{historyKey}</p>
                <ul className="cms-history__list">
                  {history.map((row) => (
                    <li key={row._id}>
                      <div className="cms-history__meta">
                        {new Date(row.createdAt).toLocaleString()} — {row.editedByEmail || 'Admin'}
                      </div>
                      <div className="cms-history__diff">
                        <del>{row.previousValue.slice(0, 120)}</del>
                        <ins>{row.newValue.slice(0, 120)}</ins>
                      </div>
                      <button type="button" onClick={() => rollback(row._id)}>
                        Rollback to previous
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
