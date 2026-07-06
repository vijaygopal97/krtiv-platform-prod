'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import type { DestinationGalleryImage } from '@/lib/destinationGalleryTypes';
import { getDestinationImages } from '@/data/destinationImages';
import { galleryApiPath } from '@/lib/galleryApiPath';
import '@/styles/destination-gallery.css';

type Props = {
  slug: string;
  destinationName: string;
};

function Lightbox({
  images,
  index,
  onClose,
  onChange,
}: {
  images: DestinationGalleryImage[];
  index: number;
  onClose: () => void;
  onChange: (n: number) => void;
}) {
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onChange((index + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, index, onChange, onClose]);

  const current = images[index];
  if (!current) return null;

  return createPortal(
    <div
      className="destination-lightbox"
      role="dialog"
      aria-modal
      aria-label={current.alt}
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null) return;
        const d = end - start;
        if (Math.abs(d) < 48) return;
        if (d < 0) onChange((index + 1) % images.length);
        else onChange((index - 1 + images.length) % images.length);
      }}
    >
      <button type="button" className="destination-lightbox__close" onClick={onClose} aria-label="Close">
        ×
      </button>
      {images.length > 1 ? (
        <>
          <button
            type="button"
            className="destination-lightbox__nav destination-lightbox__nav--prev"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index - 1 + images.length) % images.length);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className="destination-lightbox__nav destination-lightbox__nav--next"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index + 1) % images.length);
            }}
          >
            ›
          </button>
        </>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="destination-lightbox__img" src={current.full} alt={current.alt} onClick={(e) => e.stopPropagation()} />
      <p className="destination-lightbox__caption">{current.alt}</p>
    </div>,
    document.body
  );
}

export function DestinationImageGallery({ slug, destinationName }: Props) {
  const localImages = useMemo(() => getDestinationImages(slug), [slug]);
  const [images, setImages] = useState<DestinationGalleryImage[]>(localImages);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [mainLoaded, setMainLoaded] = useState(false);
  const [fade, setFade] = useState(false);
  const swipeX = useRef<number | null>(null);

  useEffect(() => {
    setImages(localImages);
    setActive(0);
    setMainLoaded(false);
  }, [slug, localImages]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(galleryApiPath(slug));
        if (!res.ok) return;
        const data = (await res.json()) as { slug?: string; images?: DestinationGalleryImage[] };
        if (cancelled) return;
        if (data.slug !== slug) return;
        if (Array.isArray(data.images) && data.images.length > 0) {
          setImages(data.images);
          setActive(0);
          setMainLoaded(false);
        }
      } catch {
        /* keep slug-local curated set */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const selectIndex = useCallback((i: number) => {
    setFade(true);
    window.setTimeout(() => {
      setActive(i);
      setMainLoaded(false);
      setFade(false);
    }, 160);
  }, []);

  const current = images[active] ?? images[0];
  if (!current) return null;

  return (
    <section className="destination-gallery" aria-labelledby="destination-gallery-heading">
      <h2 id="destination-gallery-heading" className="sr-only">
        Photo gallery — {destinationName}
      </h2>
      <div className="destination-gallery__layout">
        <button
          type="button"
          className="destination-gallery__featured"
          onClick={() => setLightbox(active)}
          aria-label={`View fullscreen: ${current.alt}`}
          onTouchStart={(e) => {
            swipeX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = swipeX.current;
            const end = e.changedTouches[0]?.clientX;
            swipeX.current = null;
            if (start == null || end == null || images.length < 2) return;
            const d = end - start;
            if (Math.abs(d) < 56) return;
            if (d < 0) selectIndex((active + 1) % images.length);
            else selectIndex((active - 1 + images.length) % images.length);
          }}
        >
          {!mainLoaded ? <div className="destination-gallery__skeleton" aria-hidden /> : null}
          <Image
            key={`${slug}-${current.id}`}
            src={current.full}
            alt={current.alt}
            fill
            priority={active === 0}
            sizes="(max-width: 1024px) 100vw, 70vw"
            className={`destination-gallery__main-img ${fade ? 'destination-gallery__main-img--fade' : ''}`}
            onLoad={() => setMainLoaded(true)}
          />
          <span className="destination-gallery__caption">{current.alt}</span>
        </button>

        <div className="destination-gallery__thumbs" role="tablist" aria-label="Gallery thumbnails">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={img.alt}
              className={`destination-gallery__thumb ${i === active ? 'destination-gallery__thumb--active' : ''}`}
              onClick={() => selectIndex(i)}
            >
              <Image src={img.thumb} alt="" fill sizes="220px" className="object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className="destination-gallery__strip mt-3" aria-label="Swipe gallery">
        {images.map((img, i) => (
          <button
            key={`strip-${img.id}`}
            type="button"
            className={`destination-gallery__strip-item ${i === active ? 'destination-gallery__strip-item--active' : ''}`}
            onClick={() => selectIndex(i)}
            aria-label={img.alt}
          >
            <Image src={img.thumb} alt="" fill sizes="200px" className="object-cover" loading="lazy" />
          </button>
        ))}
      </div>
      <p className="destination-gallery__carousel-hint">Swipe the main photo or thumbnails to explore</p>

      {lightbox != null ? (
        <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
      ) : null}
    </section>
  );
}
