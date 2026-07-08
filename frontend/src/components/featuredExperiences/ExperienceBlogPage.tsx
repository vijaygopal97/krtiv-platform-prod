'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { ImageGalleryStrip } from '@/components/krtiv/ImageGalleryStrip';
import { resolveSlideImage } from '@/lib/heroSlidesApi';
import type { ExperienceBlogListItem, ExperienceBlogRecord } from '@/types/experienceBlog';
import '@/styles/featured-experiences.css';

type Props = {
  blog: ExperienceBlogRecord;
  related: ExperienceBlogListItem[];
};

export function ExperienceBlogPage({ blog, related }: Props) {
  const hero = resolveSlideImage(blog.heroImage || '');
  const gallery = (blog.gallery || []).map(resolveSlideImage);
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const share = useCallback(async () => {
    const url = pageUrl || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: blog.title, url });
      } catch {
        /* cancelled */
      }
      return;
    }
    await navigator.clipboard.writeText(url);
  }, [blog.title, pageUrl]);

  const mapQuery = encodeURIComponent(blog.map?.query || blog.title + ' Maharashtra');
  const mapSrc =
    blog.map?.lat != null && blog.map?.lng != null
      ? `https://maps.google.com/maps?q=${blog.map.lat},${blog.map.lng}&z=11&output=embed`
      : `https://maps.google.com/maps?q=${mapQuery}&z=10&output=embed`;

  return (
    <>
      <SiteHeaderClient variant="solid" />
      <main className="bg-[color:var(--ivory)] text-[color:var(--ink)] pt-[var(--site-header-height,4rem)]">
        <header className="exp-blog-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt={blog.title} className="exp-blog-hero__img" />
          <div className="exp-blog-hero__shade" aria-hidden />
          <div className="exp-blog-hero__inner">
            {blog.subtitle ? (
              <p className="text-sm uppercase tracking-widest text-white/75">{blog.subtitle}</p>
            ) : null}
            <h1 className="display-lg mt-3 text-balance max-w-3xl">{blog.title}</h1>
          </div>
        </header>

        <article className="exp-blog-section">
          {blog.overview ? (
            <>
              <h2>Overview</h2>
              <p>{blog.overview}</p>
            </>
          ) : null}

          {blog.whyVisit ? (
            <>
              <h2>Why Visit</h2>
              <p>{blog.whyVisit}</p>
            </>
          ) : null}

          {blog.bestTimeToVisit ? (
            <>
              <h2>Best Time to Visit</h2>
              <p>{blog.bestTimeToVisit}</p>
            </>
          ) : null}

          {blog.thingsToDo?.length ? (
            <>
              <h2>Things to Do</h2>
              <ul className="exp-blog-list">
                {blog.thingsToDo.map((t) => (
                  <li key={t.label}>{t.detail ? `${t.label} — ${t.detail}` : t.label}</li>
                ))}
              </ul>
            </>
          ) : null}

          {blog.nearbyAttractions?.length ? (
            <>
              <h2>Nearby Attractions</h2>
              <ul className="exp-blog-list">
                {blog.nearbyAttractions.map((n) => (
                  <li key={n.slug}>
                    <Link href={`/blog/${n.slug}`} className="underline underline-offset-4">
                      {n.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {blog.howToReach ? (
            <>
              <h2>How to Reach</h2>
              <p>{blog.howToReach}</p>
            </>
          ) : null}

          {blog.travelTips?.length ? (
            <>
              <h2>Travel Tips</h2>
              <ul className="exp-blog-list">
                {blog.travelTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </>
          ) : null}

          {gallery.length > 0 ? (
            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="!mt-0 mb-4">Gallery</h2>
              <ImageGalleryStrip images={gallery} />
            </motion.div>
          ) : null}

          <div className="exp-blog-map" aria-label="Map">
            <iframe title={`Map of ${blog.title}`} src={mapSrc} loading="lazy" />
          </div>

          <div className="exp-blog-share">
            <button type="button" onClick={() => void share()}>
              Share
            </button>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(blog.title + ' ' + pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </article>

        {related.length > 0 ? (
          <aside className="exp-blog-related" aria-labelledby="related-exp-heading">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">
              <h2 id="related-exp-heading" className="display-md">
                Related Experiences
              </h2>
              <div className="exp-blog-related__grid">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="exp-blog-related-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resolveSlideImage(r.heroImage || '')} alt="" loading="lazy" />
                    <span>{r.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
