'use client';

import '@/styles/explore-feed.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { ExploreLightboxImage } from '@/components/explore/ExploreLightboxImage';
import { ExploreMasonryGrid } from '@/components/explore/ExploreMasonryGrid';
import { ExplorePhotoLikeButton } from '@/components/explore/ExplorePhotoLikeButton';
import { explorePhotosApiPath, exploreThumbUrl, type ExplorePhotoDto, type ExploreTag } from '@/lib/explorePhotos';

const PAGE_SIZE = 30;

type PageResponse = {
  items: ExplorePhotoDto[];
  nextCursor: number | null;
  total: number;
  catalogTotal: number;
  tags: ExploreTag[];
};

function useExploreFeed(activeTag: string, query: string) {
  const [items, setItems] = useState<ExplorePhotoDto[]>([]);
  const [tags, setTags] = useState<ExploreTag[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [catalogTotal, setCatalogTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (tag: string, q: string, start: number, append: boolean) => {
    const params = new URLSearchParams({
      tag,
      cursor: String(start),
      limit: String(PAGE_SIZE),
    });
    if (q) params.set('q', q);
    const res = await fetch(`${explorePhotosApiPath()}?${params}`);
    if (!res.ok) throw new Error('Could not load photos');
    const data = (await res.json()) as PageResponse;
    setTags(data.tags);
    setTotal(data.total);
    setCatalogTotal(data.catalogTotal);
    setNextCursor(data.nextCursor);
    setItems((prev) => (append ? [...prev, ...data.items] : data.items));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setItems([]);
    setNextCursor(0);
    void fetchPage(activeTag, query, 0, false)
      .catch(() => {
        if (!cancelled) setError('Photos could not be loaded. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTag, query, fetchPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || nextCursor == null) return;
    setLoadingMore(true);
    try {
      await fetchPage(activeTag, query, nextCursor, true);
    } catch {
      setError('Could not load more photos.');
    } finally {
      setLoadingMore(false);
    }
  }, [activeTag, query, fetchPage, loadingMore, nextCursor]);

  return { items, tags, total, catalogTotal, loading, loadingMore, error, loadMore, hasMore: nextCursor != null };
}

function ExploreLightbox({
  items,
  index,
  onClose,
  onChange,
}: {
  items: ExplorePhotoDto[];
  index: number;
  onClose: () => void;
  onChange: (next: number) => void;
}) {
  const item = items[index];
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (!item) return;
    setImgSrc(item.full);
  }, [item]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChange(Math.min(index + 1, items.length - 1));
      if (e.key === 'ArrowLeft') onChange(Math.max(index - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.body.style.touchAction = prevTouch;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, items.length, onChange, onClose]);

  if (!item) return null;

  return (
    <div
      className="explore-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.primaryLabel}
      onClick={onClose}
    >
      <div className="explore-lightbox__panel" onClick={(e) => e.stopPropagation()}>
        <div className="explore-lightbox__toolbar">
          <h2 className="font-display text-xl md:text-2xl text-[color:var(--ink)] truncate min-w-0">
            {item.primaryLabel}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <ExplorePhotoLikeButton item={item} stopPropagation={false} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-10 h-10 rounded-full border hairline bg-white grid place-items-center text-[color:var(--ink)] hover:bg-[color:var(--bone)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="explore-lightbox__stage">
          {index > 0 ? (
            <button
              type="button"
              className="explore-lightbox__nav explore-lightbox__nav--prev"
              onClick={() => onChange(index - 1)}
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : null}
          <ExploreLightboxImage
            src={imgSrc}
            alt={item.primaryLabel}
            onError={() => setImgSrc(exploreThumbUrl(item.id, 1200))}
            onSwipePrev={index > 0 ? () => onChange(index - 1) : undefined}
            onSwipeNext={index < items.length - 1 ? () => onChange(index + 1) : undefined}
          />
          {index < items.length - 1 ? (
            <button
              type="button"
              className="explore-lightbox__nav explore-lightbox__nav--next"
              onClick={() => onChange(index + 1)}
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ExploreFeed() {
  const searchParams = useSearchParams();
  const [activeTag, setActiveTag] = useState('all');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gridKey = `${activeTag}::${debouncedQuery}`;

  const { items, tags, total, catalogTotal, loading, loadingMore, error, loadMore, hasMore } = useExploreFeed(
    activeTag,
    debouncedQuery,
  );

  useEffect(() => {
    const q = searchParams.get('q');
    const tag = searchParams.get('tag');
    if (q) setQuery(q);
    if (tag) setActiveTag(tag);
  }, [searchParams]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query.trim()), 280);
    return () => window.clearTimeout(t);
  }, [query]);

  const tagPills = useMemo(
    () => [{ slug: 'all', label: 'All places', count: catalogTotal || total }, ...tags.filter((t) => t.slug !== 'maharashtra')],
    [tags, total, catalogTotal],
  );

  return (
    <section className="explore-page">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <header className="explore-page__intro">
          <p className="eyebrow text-[color:var(--saffron)]">Discover</p>
          <h1 className="display-lg mt-3 text-balance">Explore Maharashtra</h1>
          <p className="lede mt-4 max-w-2xl">
            Official tourism photography from across the state — browse by place, save what inspires you, and find it later in your dashboard.
          </p>
        </header>

        <div className="explore-page__filters">
          <div className="explore-page__search">
            <Search className="w-4 h-4 text-[color:var(--ink-soft)] shrink-0" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by place or photo name…"
              className="explore-page__search-input"
              aria-label="Search photos"
            />
          </div>

          <div className="explore-page__tags" role="tablist" aria-label="Filter by place">
            {tagPills.map((tag) => {
              const active = activeTag === tag.slug;
              return (
                <button
                  key={tag.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTag(tag.slug)}
                  className={`explore-page__tag${active ? ' explore-page__tag--active' : ''}`}
                >
                  <span>{tag.label}</span>
                  <span className="explore-page__tag-count">{tag.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="explore-page__body">
          {loading ? (
            <div className="explore-pin-board explore-pin-board--loading" aria-busy="true">
              <div className="explore-pin-board__skeleton-grid">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="explore-pin__shimmer"
                    style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 3 === 1 ? '2/3' : '4/5' }}
                  />
                ))}
              </div>
            </div>
          ) : error ? (
            <p className="explore-page__empty">{error}</p>
          ) : !items.length ? (
            <p className="explore-page__empty">No photos match this filter. Try another place or clear your search.</p>
          ) : (
            <>
              <p className="sr-only">{total} photos</p>
              <ExploreMasonryGrid
                key={gridKey}
                items={items}
                onOpen={setLightboxIndex}
                onLoadMore={loadMore}
                hasMore={hasMore}
                loadingMore={loadingMore}
              />
            </>
          )}
        </div>
      </div>

      {lightboxIndex != null ? (
        <ExploreLightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      ) : null}
    </section>
  );
}
