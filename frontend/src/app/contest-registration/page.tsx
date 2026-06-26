import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { ContestRegistrationForm } from '@/components/krtiv/ContestRegistrationForm';
import { SITE_HEADER_OFFSET_CLASS } from '@/lib/siteNavigation';

export const metadata = {
  title: 'Contest Registration — Maharashtra Tourism',
  description: 'Register for Maharashtra Tourism creative contests.',
};

export default function ContestRegistrationPage() {
  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient variant="solid" />
      <section className={`${SITE_HEADER_OFFSET_CLASS} pb-12 md:pb-16`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
          <ScrollReveal>
            <p className="eyebrow">Contest</p>
            <h1 className="display-xl mt-5 max-w-3xl text-balance">Share your Maharashtra story</h1>
            <p className="lede mt-6 max-w-2xl">
              Submit your photo or video entry celebrating Maharashtra&apos;s places, people, and traditions.
            </p>
          </ScrollReveal>
          <div className="mt-10 md:mt-14 max-w-3xl">
            <ContestRegistrationForm />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
