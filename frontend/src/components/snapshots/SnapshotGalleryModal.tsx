'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SnapshotStory } from '@/types/snapshotStory';

type Props = {
  story: SnapshotStory;
  onClose: () => void;
};

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      {dir === 'left' ? (
        <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function SnapshotGalleryModal({ story, onClose }: Props) {
  const images = story.galleryImages;
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const [zoomed, setZoomed] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + images.length) % images.length);
      setZoomed(false);
    },
    [images.length],
  );

  const close = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, go]);

  useEffect(() => {
    if (!autoplay || paused || images.length < 2) return;
    const t = window.setInterval(() => go(1), 5500);
    return () => window.clearInterval(t);
  }, [autoplay, paused, go, images.length]);

  useEffect(() => {
    const next = (index + 1) % images.length;
    const img = new Image();
    img.src = images[next]?.src ?? '';
  }, [index, images]);

  const toggleFullscreen = () => {
    const el = imgWrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  const current = images[index];

  return (
    <div className="snapshot-gallery-backdrop" role="presentation" onClick={close}>
      <div
        ref={dialogRef}
        className="snapshot-gallery-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${story.title} photo gallery`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="snapshot-gallery-header">
          <div>
            <p className="snapshot-gallery-eyebrow">{story.category}</p>
            <h2 className="snapshot-gallery-title">{story.title}</h2>
            <p className="snapshot-gallery-subtitle">{story.subtitle}</p>
          </div>
          <div className="snapshot-gallery-toolbar">
            <button
              type="button"
              className="snapshot-gallery-icon-btn"
              onClick={() => setAutoplay((v) => !v)}
              aria-pressed={autoplay}
              aria-label={autoplay ? 'Pause slideshow' : 'Play slideshow'}
            >
              {autoplay ? '❚❚' : '▶'}
            </button>
            <button
              type="button"
              className="snapshot-gallery-icon-btn"
              onClick={() => setZoomed((z) => !z)}
              aria-pressed={zoomed}
              aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
            >
              {zoomed ? '−' : '+'}
            </button>
            <button
              type="button"
              className="snapshot-gallery-icon-btn"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
            >
              ⛶
            </button>
            <button
              type="button"
              className="snapshot-gallery-close"
              onClick={close}
              aria-label="Close gallery"
            >
              ×
            </button>
          </div>
        </div>

        <div
          ref={imgWrapRef}
          className={`snapshot-gallery-stage${zoomed ? ' is-zoomed' : ''}`}
          onTouchStart={(e) => {
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchEnd={(e) => {
            if (!touchStart.current) return;
            const dx = e.changedTouches[0].clientX - touchStart.current.x;
            touchStart.current = null;
            if (Math.abs(dx) > 48) go(dx > 0 ? -1 : 1);
          }}
        >
          {!loaded[index] ? <div className="snapshot-gallery-skeleton" aria-hidden /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current.src + index}
            src={current.src}
            alt={current.alt}
            className={`snapshot-gallery-image${loaded[index] ? ' is-visible' : ''}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setLoaded((m) => ({ ...m, [index]: true }))}
            draggable={false}
          />
          <p className="snapshot-gallery-caption">{current.caption}</p>
        </div>

        <div className="snapshot-gallery-footer">
          <button
            type="button"
            className="snapshot-gallery-nav"
            onClick={() => go(-1)}
            aria-label="Previous image"
          >
            <Chevron dir="left" />
          </button>
          <p className="snapshot-gallery-counter" aria-live="polite">
            {index + 1} / {images.length}
          </p>
          <button
            type="button"
            className="snapshot-gallery-nav"
            onClick={() => go(1)}
            aria-label="Next image"
          >
            <Chevron dir="right" />
          </button>
        </div>
      </div>
    </div>
  );
}
