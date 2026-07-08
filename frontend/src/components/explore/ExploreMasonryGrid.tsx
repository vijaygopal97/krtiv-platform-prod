'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExplorePhotoLikeButton } from '@/components/explore/ExplorePhotoLikeButton';
import { estimatedCellHeight, heightFromNaturalSize } from '@/lib/exploreAspectRatio';
import { exploreThumbUrl, type ExplorePhotoDto } from '@/lib/explorePhotos';

const GAP = 12;

type LayoutCell = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

function columnCountForWidth(width: number): number {
  if (width >= 1280) return 5;
  if (width >= 1024) return 4;
  if (width >= 640) return 3;
  return 2;
}

function buildLayout(
  items: ExplorePhotoDto[],
  heights: Record<string, number>,
  containerWidth: number,
  columns: number,
): { cells: LayoutCell[]; totalHeight: number } {
  if (!containerWidth || !items.length) return { cells: [], totalHeight: 0 };

  const colWidth = (containerWidth - GAP * (columns - 1)) / columns;
  const colTops = new Array(columns).fill(0);
  const cells: LayoutCell[] = [];

  for (const item of items) {
    let col = 0;
    for (let c = 1; c < columns; c++) {
      if (colTops[c] < colTops[col]) col = c;
    }
    const height = heights[item.id] ?? estimatedCellHeight(item.id, colWidth);
    const x = col * (colWidth + GAP);
    const y = colTops[col];
    cells.push({ id: item.id, x, y, width: colWidth, height });
    colTops[col] = y + height + GAP;
  }

  return { cells: cells, totalHeight: Math.max(...colTops, 0) };
}

function MasonryTile({
  item,
  layout,
  onOpen,
  onHeightKnown,
}: {
  item: ExplorePhotoDto;
  layout: LayoutCell;
  onOpen: () => void;
  onHeightKnown: (id: string, height: number) => void;
}) {
  const [src, setSrc] = useState(item.thumb);
  const [showImg, setShowImg] = useState(false);

  const reportHeight = useCallback(
    (naturalW: number, naturalH: number) => {
      const h = heightFromNaturalSize(naturalW, naturalH, layout.width);
      onHeightKnown(item.id, h);
    },
    [item.id, layout.width, onHeightKnown],
  );

  return (
    <article
      className="explore-pin"
      style={{
        transform: `translate(${layout.x}px, ${layout.y}px)`,
        width: layout.width,
        height: layout.height,
      }}
    >
      <button
        type="button"
        className="explore-pin__btn"
        onClick={onOpen}
        aria-label={`${item.primaryLabel}: ${item.name}`}
      >
        <div className="explore-pin__media" style={{ height: layout.height }}>
          {!showImg ? <div className="explore-pin__shimmer" aria-hidden /> : null}
          <img
            src={src}
            alt=""
            width={layout.width}
            height={layout.height}
            loading="lazy"
            decoding="async"
            className={`explore-pin__img${showImg ? ' explore-pin__img--visible' : ''}`}
            onLoad={(e) => {
              setShowImg(true);
              reportHeight(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight);
            }}
            onError={() => setSrc(exploreThumbUrl(item.id, 800))}
          />
        </div>
        <div className="explore-pin__overlay">
          <p className="explore-pin__label">{item.primaryLabel}</p>
        </div>
        <div className="explore-pin__like">
          <ExplorePhotoLikeButton item={item} size="sm" />
        </div>
      </button>
    </article>
  );
}

type Props = {
  items: ExplorePhotoDto[];
  onOpen: (index: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
};

export function ExploreMasonryGrid({ items, onOpen, onLoadMore, hasMore, loadingMore }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [heights, setHeights] = useState<Record<string, number>>({});

  const columns = columnCountForWidth(containerWidth);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setContainerWidth(Math.floor(w));
    });
    ro.observe(el);
    setContainerWidth(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  const onHeightKnown = useCallback((id: string, height: number) => {
    setHeights((prev) => {
      if (prev[id] != null && Math.abs(prev[id] - height) < 6) return prev;
      return { ...prev, [id]: height };
    });
  }, []);

  const { cells, totalHeight } = useMemo(
    () => buildLayout(items, heights, containerWidth, columns),
    [items, heights, containerWidth, columns],
  );

  const idToIndex = useMemo(() => new Map(items.map((it, i) => [it.id, i])), [items]);

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || !onLoadMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, totalHeight]);

  return (
    <div ref={containerRef} className="explore-pin-board">
      <div className="explore-pin-board__canvas" style={{ height: totalHeight || 1 }}>
        {cells.map((cell) => {
          const item = items.find((it) => it.id === cell.id);
          if (!item) return null;
          const index = idToIndex.get(item.id) ?? 0;
          return (
            <MasonryTile
              key={item.id}
              item={item}
              layout={cell}
              onOpen={() => onOpen(index)}
              onHeightKnown={onHeightKnown}
            />
          );
        })}
        {hasMore ? (
          <div
            ref={sentinelRef}
            className="explore-pin-board__sentinel"
            style={{ transform: `translateY(${totalHeight}px)` }}
            aria-hidden
          />
        ) : null}
      </div>
      {loadingMore ? <p className="explore-page__loading-more">Loading more…</p> : null}
    </div>
  );
}
