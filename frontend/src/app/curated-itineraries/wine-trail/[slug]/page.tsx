import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { PlaceHeroItineraryBridge } from '@/components/krtiv/PlaceHeroItineraryBridge';
import { MAHARASHTRA_DISTRICTS } from '@/data/maharashtraDistricts';
import { WineTrailHeroSection } from '@/components/krtiv/WineTrailHeroSection';
import { DestinationGallerySection } from '@/components/krtiv/DestinationGallerySection';
import { DestinationPracticalInfo } from '@/components/krtiv/DestinationPracticalInfo';
import { ItineraryStory } from '@/components/krtiv/ItineraryStory';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import {
  allWineTrailSlugs,
  getWineTrailDestination,
  wineTrailAsItinerary,
} from '@/data/wineTrailDestinations';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allWineTrailSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const dest = getWineTrailDestination(slug);
  if (!dest) return { title: 'Wine Trail — Maharashtra Tourism' };
  return {
    title: `${dest.title} — Wine Trail — Maharashtra Tourism`,
    description: dest.description,
  };
}

export default async function WineTrailDestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = getWineTrailDestination(slug);
  if (!destination) notFound();

  const itinerary = wineTrailAsItinerary(destination);

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient />
      <WineTrailHeroSection destination={destination} />
      <PlaceHeroItineraryBridge
        currentDestination={destination.title}
        rotationNames={MAHARASHTRA_DISTRICTS}
      />
      <SmartKeywordItinerary
        context="culinary"
        sectionId="wine-smart-itinerary"
        heading={`Plan your ${destination.title} tasting route`}
        subheading="Pick vineyards, food, and pace — we'll shape a personalised Wine Trail itinerary."
        className="bg-white border-b hairline"
        compact
        placeSlug={destination.slug === 'nashik' || destination.slug === 'pune' ? destination.slug : undefined}
        placeTitle={destination.title}
      />
      <DestinationPracticalInfo
        topAttractions={destination.topAttractions}
        bestTimeToVisit={destination.bestTimeToVisit}
        localFood={destination.localFood}
        travelTips={destination.travelTips}
        nearbyDestinations={[
          { label: 'All Wine Trail routes', href: '/curated-itineraries/wine-trail' },
          ...destination.nearbyDestinations,
        ]}
      />
      <DestinationGallerySection title={destination.title} images={destination.gallery} />
      {itinerary.days.length > 0 ? (
        <ItineraryStory
          itinerary={itinerary}
          sectionId="suggested-itinerary"
          heading="Suggested itinerary"
          sidePanel="map"
          mapPanelId="itinerary-map"
          seamlessTop
          plannerAnchor="#wine-smart-itinerary"
        />
      ) : null}
      <section className="bg-[color:var(--bone)]/40 border-t hairline py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-sm text-[color:var(--ink-soft)]">
            Part of Maharashtra&apos;s curated Wine Trail
          </p>
          <Link
            href="/curated-itineraries/wine-trail"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--saffron)] hover:underline underline-offset-4"
          >
            View all Wine Trail destinations <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
