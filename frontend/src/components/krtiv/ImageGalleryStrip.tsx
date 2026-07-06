'use client';

import { useState } from 'react';
import { ImageLightbox } from '@/components/krtiv/ImageLightbox';
import '@/styles/image-gallery.css';

type Props = {
  images: string[];
  className?: string;
};

/** Horizontal gallery strip — blog-post thumbnail sizing with scroll. */
export function ImageGalleryStrip({ images, className = '' }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const gallery = images.filter(Boolean);

  if (!gallery.length) return null;

  return (
    <>
      <div className={`gallery-scroll-row ${className}`.trim()} role="list" aria-label="Photo gallery">
        {gallery.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            className="gallery-scroll-row__item"
            onClick={() => setLightbox(index)}
            aria-label={`View image ${index + 1} of ${gallery.length}`}
            role="listitem"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading={index < 8 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>
      <ImageLightbox
        images={gallery}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </>
  );
}
