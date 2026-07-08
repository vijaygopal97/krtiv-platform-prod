import Link from 'next/link';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { PlaceHeroItineraryBridge } from '@/components/krtiv/PlaceHeroItineraryBridge';
import { MAHARASHTRA_DISTRICTS } from '@/data/maharashtraDistricts';
import { CuratedExperienceHeroSection } from '@/components/krtiv/CuratedExperienceHeroSection';
import { DestinationGallerySection } from '@/components/krtiv/DestinationGallerySection';
import { DestinationPracticalInfo } from '@/components/krtiv/DestinationPracticalInfo';
import { ItineraryStory } from '@/components/krtiv/ItineraryStory';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import {
  experienceAsItinerary,
  type CuratedExperienceRecord,
  type CuratedExperienceTrail,
} from '@/data/curatedExperiences';

const TRAIL_COPY: Record<
  CuratedExperienceTrail,
  { label: string; plannerSubheading: string; footer: string }
> = {
  'nature-trails': {
    label: 'Nature Trails',
    plannerSubheading:
      "Choose the wildlife and nature experiences that match your trip — we'll craft a personalised Nature Trails itinerary.",
    footer: "Part of Maharashtra's curated Nature Trails",
  },
  'monsoon-trails': {
    label: 'Monsoon Trails',
    plannerSubheading:
      "Pick monsoon waterfalls, drives, and treks — we'll build a personalised Monsoon Trails itinerary around the season.",
    footer: "Part of Maharashtra's curated Monsoon Trails",
  },
};

export function CuratedExperienceGuidePage({
  guide,
  trail,
}: {
  guide: CuratedExperienceRecord;
  trail: CuratedExperienceTrail;
}) {
  const copy = TRAIL_COPY[trail];
  const itinerary = experienceAsItinerary(guide);
  const indexHref = `/curated-itineraries/${trail}`;

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient />
      <CuratedExperienceHeroSection guide={guide} trail={trail} />
      <PlaceHeroItineraryBridge currentDestination={guide.title} rotationNames={MAHARASHTRA_DISTRICTS} />
      <SmartKeywordItinerary
        context="adventure"
        sectionId="experience-smart-itinerary"
        heading={`Plan your ${guide.title} journey`}
        subheading={copy.plannerSubheading}
        className="bg-white border-b hairline"
        compact
        placeSlug={guide.plannerPlaceSlug}
        placeTitle={guide.title}
      />
      <DestinationPracticalInfo
        topAttractions={guide.topAttractions}
        bestTimeToVisit={guide.bestTimeToVisit}
        localFood={guide.localFood}
        travelTips={guide.travelTips}
        nearbyDestinations={[
          { label: `All ${copy.label}`, href: indexHref },
        ]}
      />
      <DestinationGallerySection title={guide.title} images={guide.gallery} />
      <ItineraryStory
        itinerary={itinerary}
        sectionId="suggested-itinerary"
        heading="Suggested itinerary"
        sidePanel="map"
        mapPanelId="itinerary-map"
        seamlessTop
        showTalkToPlanner={false}
        plannerAnchor="#experience-smart-itinerary"
      />
      <section className="bg-[color:var(--bone)]/40 border-t hairline py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-sm text-[color:var(--ink-soft)]">{copy.footer}</p>
          <Link
            href={indexHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--saffron)] hover:underline underline-offset-4"
          >
            View all {copy.label} <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
