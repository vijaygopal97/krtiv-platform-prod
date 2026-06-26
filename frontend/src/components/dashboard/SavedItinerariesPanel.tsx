'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  deleteItinerary,
  fetchMyItineraries,
  toggleFavoriteItinerary,
  type SavedItineraryRecord,
} from '@/lib/myItinerariesApi';
import { parseItineraryText } from '@/lib/parseItinerary';
import { extractItineraryExtras } from '@/lib/itineraryExtras';
import { downloadItineraryPdf } from '@/lib/itineraryPdf';
import CompactItineraryView from '@/components/dashboard/CompactItineraryView';

export default function SavedItinerariesPanel({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const [items, setItems] = useState<SavedItineraryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await fetchMyItineraries(favoritesOnly);
    setItems(list);
    setLoading(false);
  }, [favoritesOnly]);

  useEffect(() => {
    void load();
  }, [load]);

  const onToggleFavorite = async (id: string, next: boolean) => {
    const ok = await toggleFavoriteItinerary(id, next);
    if (ok) void load();
  };

  const onDelete = async (id: string) => {
    const ok = await deleteItinerary(id);
    if (ok) {
      if (openId === id) setOpenId(null);
      void load();
    }
  };

  if (loading) {
    return <p className="text-sm text-[color:var(--ink-soft)] p-6">Loading…</p>;
  }

  if (!items.length) {
    return (
      <p className="text-sm text-[color:var(--ink-soft)] p-8 text-center">
        {favoritesOnly ? 'No favorites yet. Save an itinerary and mark it as favorite.' : 'No saved itineraries yet.'}
      </p>
    );
  }

  return (
    <ul className="divide-y hairline">
      {items.map((item) => {
        const open = openId === item._id;
        let parsed = null;
        if (open) {
          try {
            parsed = parseItineraryText(item.itineraryText);
          } catch {
            parsed = null;
          }
        }
        return (
          <li key={item._id} className="p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <button type="button" onClick={() => setOpenId(open ? null : item._id)} className="text-left flex-1">
                <p className="font-semibold text-[color:var(--ink)]">{item.title}</p>
                <p className="text-xs text-[color:var(--ink-soft)] mt-1">
                  {item.categoryFocus || 'Maharashtra'}
                  {item.keywords?.length ? ` · ${item.keywords.slice(0, 4).join(', ')}` : ''}
                </p>
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(item._id, !item.isFavorite)}
                  className="text-xs px-3 h-8 rounded-full border hairline"
                >
                  {item.isFavorite ? '★ Favorited' : '☆ Favorite'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item._id)}
                  className="text-xs px-3 h-8 rounded-full border border-red-200 text-red-700"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    let p;
                    try {
                      p = parseItineraryText(item.itineraryText);
                    } catch {
                      return;
                    }
                    const extras = extractItineraryExtras(item.itineraryText);
                    downloadItineraryPdf({
                      title: item.title,
                      parsed: p,
                      rawText: item.itineraryText,
                      extras,
                      keywords: item.keywords || [],
                      categoryFocus: item.categoryFocus || 'Maharashtra Tourism',
                    });
                  }}
                  className="text-xs px-3 h-8 rounded-full border hairline"
                >
                  PDF
                </button>
              </div>
            </div>
            {open && parsed && parsed.days?.length > 0 && (
              <div className="mt-4">
                <CompactItineraryView title={item.title} parsed={parsed} />
              </div>
            )}
            {open && !parsed && (
              <pre className="mt-4 text-xs whitespace-pre-wrap bg-white p-4 rounded-xl border hairline max-h-96 overflow-auto">
                {item.itineraryText}
              </pre>
            )}
          </li>
        );
      })}
    </ul>
  );
}
