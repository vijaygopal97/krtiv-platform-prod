import { notFound, redirect } from 'next/navigation';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { PlaceHeroSection } from '@/components/krtiv/PlaceHeroSection';
import { PlaceHeroItineraryBridge } from '@/components/krtiv/PlaceHeroItineraryBridge';
import { ItineraryStory } from '@/components/krtiv/ItineraryStory';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import { getDestination, allDestinationSlugs } from '@/data/destinations';
import { CURATED_ITINERARIES_LABEL } from '@/lib/siteNavigation';
import { DESTINATION_SLUG_REDIRECTS } from '@/lib/destinationRedirects';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const canonical = allDestinationSlugs().map((slug) => ({ slug }));
  const legacy = Object.keys(DESTINATION_SLUG_REDIRECTS).map((slug) => ({ slug }));
  return [...canonical, ...legacy];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const place = getDestination(slug);
  if (!place) return { title: 'Places to Go — Maharashtra Tourism' };
  return {
    title: `${place.title} — ${CURATED_ITINERARIES_LABEL} — Maharashtra Tourism`,
    description: place.description,
  };
}

export default async function PlaceToGoPage({ params }: Props) {
  const { slug } = await params;
  const canonical = DESTINATION_SLUG_REDIRECTS[slug];
  if (canonical) {
    redirect(`/places-to-go/${canonical}`);
  }

  const place = getDestination(slug);
  if (!place) notFound();

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient />
      <PlaceHeroSection place={place} />
      <PlaceHeroItineraryBridge currentDestination={place.title} />
      <SmartKeywordItinerary
        context="explore"
        sectionId="place-smart-itinerary"
        heading={`Plan your ${place.title} journey`}
        subheading="Tap a few interests below — we'll shape a personalised itinerary around this destination."
        className="bg-white border-b hairline"
        compact
        placeSlug={slug}
        placeTitle={place.title}
      />
      <ItineraryStory
        itinerary={place}
        sectionId="suggested-itinerary"
        heading="Suggested 3-day itinerary"
        sidePanel="map"
        mapPanelId="itinerary-map"
        seamlessTop
        showTalkToPlanner={false}
        plannerAnchor="#place-smart-itinerary"
      />
      <SiteFooter />
    </main>
  );
}
