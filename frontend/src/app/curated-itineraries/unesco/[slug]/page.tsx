import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { PlaceHeroItineraryBridge } from '@/components/krtiv/PlaceHeroItineraryBridge';
import { MAHARASHTRA_DISTRICTS } from '@/data/maharashtraDistricts';
import { UnescoSiteHeroSection } from '@/components/krtiv/UnescoSiteHeroSection';
import { DestinationGallerySection } from '@/components/krtiv/DestinationGallerySection';
import { DestinationPracticalInfo } from '@/components/krtiv/DestinationPracticalInfo';
import { ItineraryStory } from '@/components/krtiv/ItineraryStory';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import {
  allUnescoSiteSlugs,
  getUnescoSite,
  unescoSiteAsItinerary,
} from '@/data/unescoSites';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allUnescoSiteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const site = getUnescoSite(slug);
  if (!site) return { title: 'UNESCO World Heritage — Maharashtra Tourism' };
  return {
    title: `${site.title} — UNESCO World Heritage — Maharashtra Tourism`,
    description: site.description,
  };
}

export default async function UnescoSitePage({ params }: Props) {
  const { slug } = await params;
  const site = getUnescoSite(slug);
  if (!site) notFound();

  const itinerary = unescoSiteAsItinerary(site);

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient />
      <UnescoSiteHeroSection site={site} />
      <PlaceHeroItineraryBridge currentDestination={site.title} rotationNames={MAHARASHTRA_DISTRICTS} />
      <SmartKeywordItinerary
        context="explore"
        sectionId="unesco-smart-itinerary"
        heading={`Plan your ${site.title} journey`}
        subheading="Choose the experiences that match your visit — we'll craft a personalised UNESCO heritage itinerary."
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
        nearbyDestinations={[
          { label: 'All UNESCO sites', href: '/curated-itineraries/unesco' },
          ...site.nearbyDestinations,
        ]}
      />
      <DestinationGallerySection title={site.title} images={site.gallery} />
      <ItineraryStory
        itinerary={itinerary}
        sectionId="suggested-itinerary"
        heading="Suggested itinerary"
        sidePanel="map"
        mapPanelId="itinerary-map"
        seamlessTop
        showTalkToPlanner={false}
        plannerAnchor="#unesco-smart-itinerary"
      />
      <section className="bg-[color:var(--bone)]/40 border-t hairline py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-sm text-[color:var(--ink-soft)]">
            Part of Maharashtra&apos;s seven UNESCO World Heritage Sites
          </p>
          <Link
            href="/curated-itineraries/unesco"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--saffron)] hover:underline underline-offset-4"
          >
            View all UNESCO sites <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
