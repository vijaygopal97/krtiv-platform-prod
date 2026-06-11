import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { HomeHeroSection } from '@/components/krtiv/HomeHeroSection';
import { CategoryShowcase } from '@/components/krtiv/CategoryShowcase';
import { IntroBand } from '@/components/krtiv/IntroBand';
import { SignatureExperiences } from '@/components/krtiv/SignatureExperiences';
import { CtaBandInteractive } from '@/components/krtiv/CtaBandInteractive';

export const metadata = {
  title: 'Maharashtra Tourism — You will find India here',
  description:
    'An editorial guide to Maharashtra: forts, ghats, coasts and villages, planned for the unhurried traveler.',
};

export default function HomePage() {
  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient />
      <HomeHeroSection />
      <IntroBand />
      <CategoryShowcase />
      <SignatureExperiences />
      <CtaBandInteractive />
      <SiteFooter />
    </main>
  );
}
