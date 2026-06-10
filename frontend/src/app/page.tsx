import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { HeroSection } from '@/components/krtiv/HeroSection';
import { HomeHeroVideo } from '@/components/krtiv/HomeHeroVideo';
import { CategoryShowcase } from '@/components/krtiv/CategoryShowcase';
import { IntroBand } from '@/components/krtiv/IntroBand';
import { SignatureExperiences } from '@/components/krtiv/SignatureExperiences';
import { CtaBandInteractive } from '@/components/krtiv/CtaBandInteractive';
import { krtivHeroImage } from '@/lib/krtivPaths';

export const metadata = {
  title: 'Maharashtra Tourism — You will find India here',
  description:
    'An editorial guide to Maharashtra: forts, ghats, coasts and villages, planned for the unhurried traveler.',
};

export default function HomePage() {
  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient />
      <HeroSection
        eyebrow="Discover Incredible Maharashtra"
        title="You will find India here"
        subtitle="Seven curated journeys across forts, ghats, coasts and quiet villages — written for travelers who like to read the place slowly."
        image={krtivHeroImage()}
        videoTitle="Watch The Journey Through Maharashtra"
        videoMeta="Featured · Maharashtra Tourism"
        primaryHref="/#itinerary-generator"
        primaryLabel="Plan with AI"
        secondaryHref="/#explore-by-categories"
        secondaryLabel="Explore the state"
        exploreHref="/#explore-by-categories"
        exploreLabel="Explore itineraries"
        videoSlot={<HomeHeroVideo />}
      />
      <IntroBand />
      <CategoryShowcase />
      <SignatureExperiences />
      <CtaBandInteractive />
      <SiteFooter />
    </main>
  );
}
