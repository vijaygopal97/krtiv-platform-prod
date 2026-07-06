import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { PlaceHeroItineraryBridge } from '@/components/krtiv/PlaceHeroItineraryBridge';
import { MAHARASHTRA_DISTRICTS } from '@/data/maharashtraDistricts';
import { WeekendGetawayHeroSection } from '@/components/krtiv/WeekendGetawayHeroSection';
import { DestinationGallerySection } from '@/components/krtiv/DestinationGallerySection';
import { DestinationPracticalInfo } from '@/components/krtiv/DestinationPracticalInfo';
import { ItineraryStory } from '@/components/krtiv/ItineraryStory';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import {
  allWeekendGetawaySlugs,
  getWeekendGetaway,
  weekendGetawayAsItinerary,
} from '@/data/weekendGetaways';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allWeekendGetawaySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const getaway = getWeekendGetaway(slug);
  if (!getaway) return { title: 'Weekend Getaways — Maharashtra Tourism' };
  return {
    title: `${getaway.title} — Weekend Getaways — Maharashtra Tourism`,
    description: getaway.description,
  };
}

export default async function WeekendGetawayPage({ params }: Props) {
  const { slug } = await params;
  const getaway = getWeekendGetaway(slug);
  if (!getaway) notFound();

  const itinerary = weekendGetawayAsItinerary(getaway);

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient />
      <WeekendGetawayHeroSection getaway={getaway} />
      <PlaceHeroItineraryBridge currentDestination={getaway.title} rotationNames={MAHARASHTRA_DISTRICTS} />
      <SmartKeywordItinerary
        context="explore"
        sectionId="weekend-smart-itinerary"
        heading={`Plan your ${getaway.title} weekend`}
        subheading="Pick a few interests — we'll shape a personalised 3-day escape around this destination."
        className="bg-white border-b hairline"
        compact
        placeSlug={getaway.slug}
        placeTitle={getaway.title}
      />
      <DestinationPracticalInfo
        topAttractions={getaway.topAttractions}
        bestTimeToVisit={getaway.bestTimeToVisit}
        localFood={getaway.localFood}
        travelTips={getaway.travelTips}
        nearbyDestinations={[
          { label: 'All weekend getaways', href: '/curated-itineraries/weekend-getaways' },
          ...getaway.nearbyDestinations,
        ]}
      />
      <DestinationGallerySection title={getaway.title} images={getaway.gallery} />
      <ItineraryStory
        itinerary={itinerary}
        sectionId="suggested-itinerary"
        heading="Suggested 3-day itinerary"
        sidePanel="map"
        mapPanelId="itinerary-map"
        seamlessTop
        showTalkToPlanner={false}
        plannerAnchor="#weekend-smart-itinerary"
      />
      <section className="bg-[color:var(--bone)]/40 border-t hairline py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-sm text-[color:var(--ink-soft)]">
            Part of Maharashtra&apos;s curated Weekend Getaways collection
          </p>
          <Link
            href="/curated-itineraries/weekend-getaways"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--saffron)] hover:underline underline-offset-4"
          >
            View all weekend getaways <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
