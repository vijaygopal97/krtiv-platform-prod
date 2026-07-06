'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useCmsOptional } from '@/components/cms/CmsContext';

function pageSlugFromPath(pathname: string): string {
  if (pathname === '/' || pathname === '') return 'home';
  const seg = pathname.split('/').filter(Boolean)[0];
  return seg || 'home';
}

export function CmsPageMeta() {
  const pathname = usePathname() ?? '/';
  const page = useMemo(() => pageSlugFromPath(pathname), [pathname]);
  const cms = useCmsOptional();

  useEffect(() => {
    if (!cms) return;
    const title = cms.getText(`${page}.seo.title`, '');
    const description = cms.getText(`${page}.seo.description`, '');
    const keywords = cms.getText(`${page}.seo.keywords`, '');
    const ogImage = cms.getText(`${page}.seo.ogImage`, '');

    if (title) document.title = title;

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('og:title', title || document.title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:image', ogImage, 'property');
  }, [cms, page, cms?.content]);

  return null;
}
