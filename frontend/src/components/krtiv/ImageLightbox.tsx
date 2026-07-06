'use client';

import { useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import '@/styles/image-gallery.css';

type Props = {
  images: string[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function ImageLightbox({ images, index, onClose, onIndexChange }: Props) {
  const hasPrev = index != null && index > 0;
  const hasNext = index != null && index < images.length - 1;

  const goPrev = useCallback(() => {
    if (index == null || index <= 0) return;
    onIndexChange(index - 1);
  }, [index, onIndexChange]);

  const goNext = useCallback(() => {
    if (index == null || index >= images.length - 1) return;
    onIndexChange(index + 1);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    if (index == null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [goNext, goPrev, index, onClose]);

  if (index == null || !images[index]) return null;

  return (
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery viewer"
      onClick={onClose}
    >
      <button type="button" className="image-lightbox__close" onClick={onClose} aria-label="Close gallery">
        <X className="w-6 h-6" aria-hidden />
      </button>

      <p className="image-lightbox__counter" aria-live="polite">
        {index + 1} / {images.length}
      </p>

      {hasPrev ? (
        <button
          type="button"
          className="image-lightbox__nav image-lightbox__nav--prev"
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-7 h-7" aria-hidden />
        </button>
      ) : null}

      {hasNext ? (
        <button
          type="button"
          className="image-lightbox__nav image-lightbox__nav--next"
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
          aria-label="Next image"
        >
          <ChevronRight className="w-7 h-7" aria-hidden />
        </button>
      ) : null}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt=""
        className="image-lightbox__img"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
