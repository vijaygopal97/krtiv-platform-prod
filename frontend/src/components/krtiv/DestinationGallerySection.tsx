'use client';

import { ImageGalleryStrip } from '@/components/krtiv/ImageGalleryStrip';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';

type Props = {
  title: string;
  images: string[];
};

export function DestinationGallerySection({ title, images }: Props) {
  const gallery = images.filter(Boolean);
  if (!gallery.length) return null;

  return (
    <section className="bg-[color:var(--ivory)] py-16 md:py-24 border-t hairline" aria-labelledby="destination-gallery-heading">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <ScrollReveal>
          <p className="eyebrow">Gallery</p>
          <h2 id="destination-gallery-heading" className="display-md mt-4 text-balance">
            {title} in focus
          </h2>
        </ScrollReveal>
        <div className="mt-8 md:mt-10">
          <ImageGalleryStrip images={gallery} />
        </div>
      </div>
    </section>
  );
}
