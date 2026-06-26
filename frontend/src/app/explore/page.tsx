import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { CategoryShowcase } from '@/components/krtiv/CategoryShowcase';
import { ExplorePageHero } from '@/components/krtiv/ExplorePageHero';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';

export const metadata = {
  title: 'Things to Do — Maharashtra Tourism',
  description: 'Browse circuits and generate a personalized Maharashtra itinerary from your interests.',
};

export default function ExplorePage() {
  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient />
      <ExplorePageHero />
      <SmartKeywordItinerary
        context="explore"
        heading="What would you like to do in Maharashtra?"
        subheading="Select all experiences that interest you, and we'll create a personalized AI-powered itinerary tailored to your preferences."
        className="bg-white border-y hairline"
      />
      <CategoryShowcase showPlanner={false} />
      <SiteFooter />
    </main>
  );
}
