import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { PlaceHeroItineraryBridge } from '@/components/krtiv/PlaceHeroItineraryBridge';
import { MAHARASHTRA_DISTRICTS } from '@/data/maharashtraDistricts';
import { TimelessIconHeroSection } from '@/components/krtiv/TimelessIconHeroSection';
import { DestinationOverviewSection } from '@/components/krtiv/DestinationOverviewSection';
import { DestinationGallerySection } from '@/components/krtiv/DestinationGallerySection';
import { DestinationPracticalInfo } from '@/components/krtiv/DestinationPracticalInfo';
import { ItineraryStory } from '@/components/krtiv/ItineraryStory';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import {
  allTimelessIconSlugs,
  getTimelessIcon,
  timelessIconAsItinerary,
} from '@/data/timelessIcons';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allTimelessIconSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const site = getTimelessIcon(slug);
  if (!site) return { title: 'Timeless Icons of Maharashtra — Maharashtra Tourism' };
  return {
    title: `${site.title} — Timeless Icons of Maharashtra — Maharashtra Tourism`,
    description: site.description,
  };
}

export default async function TimelessIconPage({ params }: Props) {
  const { slug } = await params;
  const site = getTimelessIcon(slug);
  if (!site) notFound();

  const itinerary = timelessIconAsItinerary(site);

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient />
      <TimelessIconHeroSection site={site} />
      <PlaceHeroItineraryBridge currentDestination={site.title} rotationNames={MAHARASHTRA_DISTRICTS} />
      <DestinationOverviewSection
        title={site.title}
        subtitle={site.region}
        paragraphs={site.overview}
      />
      <SmartKeywordItinerary
        context="explore"
        sectionId="timeless-smart-itinerary"
        heading={`Plan your ${site.title} journey`}
        subheading="Choose the experiences that match your visit — we'll craft a personalised Timeless Icons itinerary."
        className="bg-white border-b hairline"
        compact
        placeSlug={site.plannerPlaceSlug}
        placeTitle={site.title}
      />
      <DestinationPracticalInfo
        topAttractions={site.topAttractions}
        bestTimeToVisit={site.bestTimeToVisit}
        localFood={site.localFood}
        travelTips={site.travelTips}
        nearbyDestinations={site.nearbyDestinations}
      />
      <DestinationGallerySection
        title={site.title}
        images={site.gallery}
      />
      <ItineraryStory
        itinerary={itinerary}
        sectionId="suggested-itinerary"
        heading="Suggested 3-day itinerary"
        sidePanel="map"
        mapPanelId="itinerary-map"
        seamlessTop
        showTalkToPlanner={false}
        plannerAnchor="#timeless-smart-itinerary"
      />
      <section className="bg-[color:var(--bone)]/40 border-t hairline py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-sm text-[color:var(--ink-soft)]">
            Part of Maharashtra&apos;s Timeless Icons — chosen in 2013 by public vote
          </p>
          <Link
            href="/curated-itineraries/seven-wonders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--saffron)] hover:underline underline-offset-4"
          >
            View all Timeless Icons <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
