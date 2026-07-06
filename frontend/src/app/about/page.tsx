import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { AboutPageContent } from '@/components/krtiv/AboutPageContent';
import { SITE_HEADER_OFFSET_CLASS } from '@/lib/siteNavigation';

export const metadata = { title: 'About — Maharashtra Tourism' };

export default function AboutPage() {
  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient variant="solid" />
      <div className={SITE_HEADER_OFFSET_CLASS}>
        <AboutPageContent />
      </div>
      <SiteFooter />
    </main>
  );
}
