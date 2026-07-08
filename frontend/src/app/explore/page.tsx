import { Suspense } from 'react';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import ExploreFeed from '@/components/explore/ExploreFeed';
import { SITE_HEADER_OFFSET_CLASS } from '@/lib/siteNavigation';

export const metadata = {
  title: 'Explore — Maharashtra Tourism',
  description:
    'Browse official Maharashtra tourism photography — filter by place, save favourites to your dashboard, and get inspired for your next trip.',
};

export default function ExplorePage() {
  return (
    <main className={`bg-[color:var(--ivory)] text-[color:var(--ink)] ${SITE_HEADER_OFFSET_CLASS}`}>
      <SiteHeaderClient variant="solid" />
      <Suspense
        fallback={
          <div className="max-w-[1440px] mx-auto px-6 py-24 text-center text-[color:var(--ink-soft)]">
            Loading explore…
          </div>
        }
      >
        <ExploreFeed />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
