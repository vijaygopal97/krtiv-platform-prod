import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { HomeHeroWithPlanner } from '@/components/krtiv/HomeHeroWithPlanner';
import { TravelStoriesSection } from '@/components/travelStories/TravelStoriesSection';
import { FloatingInterestBubbles } from '@/components/krtiv/FloatingInterestBubbles';
import { CategoryShowcase } from '@/components/krtiv/CategoryShowcase';
import { IntroBand } from '@/components/krtiv/IntroBand';
import { SignatureExperiences } from '@/components/krtiv/SignatureExperiences';
import { FeaturedExperiencesSection } from '@/components/featuredExperiences/FeaturedExperiencesSection';
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
      <HomeHeroWithPlanner />
      <FloatingInterestBubbles />
      <CategoryShowcase showPlanner={false} />
      <TravelStoriesSection />
      <IntroBand />
      <SignatureExperiences />
      <FeaturedExperiencesSection />
      <CtaBandInteractive />
      <SiteFooter />
    </main>
  );
}
