import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { DidYouKnowStackedCarousel } from '@/components/krtiv/DidYouKnowStackedCarousel';
import { CuratedSpotlightGrid } from '@/components/krtiv/CuratedSpotlightGrid';
import { CuratedTrailAmbientShell } from '@/components/krtiv/CuratedTrailAmbientShell';
import { PlaceHeroItineraryBridge } from '@/components/krtiv/PlaceHeroItineraryBridge';
import { MAHARASHTRA_DISTRICTS } from '@/data/maharashtraDistricts';
import { MonsoonTrailHeroSection } from '@/components/krtiv/MonsoonTrailHeroSection';
import { DestinationOverviewSection } from '@/components/krtiv/DestinationOverviewSection';
import { DestinationGallerySection } from '@/components/krtiv/DestinationGallerySection';
import { DestinationPracticalInfo } from '@/components/krtiv/DestinationPracticalInfo';
import { ItineraryStory } from '@/components/krtiv/ItineraryStory';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import {
  allMonsoonCategorySlugs,
  getMonsoonCategoryActivitySpotlights,
  getMonsoonTrailCategory,
  isMonsoonCategorySlug,
} from '@/data/monsoonTrailCategories';
import {
  allMonsoonTrailSiteSlugs,
  getMonsoonTrailSite,
  monsoonTrailAsItinerary,
} from '@/data/monsoonTrails';
import { SITE_HEADER_OFFSET_CLASS } from '@/lib/siteNavigation';
import { getMonsoonCategoryFacts } from '@/data/destinationFacts';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return [
    ...allMonsoonCategorySlugs().map((slug) => ({ slug })),
    ...allMonsoonTrailSiteSlugs().map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (isMonsoonCategorySlug(slug)) {
    const category = getMonsoonTrailCategory(slug);
    if (!category) return { title: 'Monsoon Trails — Maharashtra Tourism' };
    return {
      title: `${category.title} — Monsoon Trails — Maharashtra Tourism`,
      description: category.description,
    };
  }
  const site = getMonsoonTrailSite(slug);
  if (!site) return { title: 'Monsoon Trails — Maharashtra Tourism' };
  return {
    title: `${site.title} — Monsoon Trails — Maharashtra Tourism`,
    description: site.description,
  };
}

function MonsoonCategoryListingPage({ slug }: { slug: string }) {
  const category = getMonsoonTrailCategory(slug);
  if (!category) notFound();

  const spotlights = getMonsoonCategoryActivitySpotlights(category.slug);
  const facts = getMonsoonCategoryFacts(category.slug);

  return (
    <CuratedTrailAmbientShell>
      <SiteHeaderClient variant="solid" />
      <section className={`${SITE_HEADER_OFFSET_CLASS} pb-16 md:pb-24`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
          <ScrollReveal>
            <p className="eyebrow">Curated Itineraries · Monsoon Trails</p>
            <div className="mt-5 grid md:grid-cols-12 gap-6 md:gap-y-8 md:gap-x-14 lg:gap-x-20 items-center">
              <h1 className="display-xl md:col-span-5 text-balance text-center md:text-left">
                {category.title}
              </h1>
              <div className="md:col-span-7 flex min-h-0 items-center justify-center md:px-6 lg:px-10">
                <p className="lede text-center max-w-md lg:max-w-xl mx-auto">{category.description}</p>
              </div>
            </div>
          </ScrollReveal>

          {facts.length ? (
            <DidYouKnowStackedCarousel
              facts={facts}
              placeName={category.title}
              embedded
              backgroundImage="/curated/monsoon-trails/tamhini-ghat.jpg"
            />
          ) : null}

          <CuratedSpotlightGrid spotlights={spotlights} trailSlug="monsoon-trails" />

          <p className="mt-10 text-sm text-[color:var(--ink-soft)]">
            <Link
              href="/curated-itineraries/monsoon-trails"
              className="underline underline-offset-4 hover:text-[color:var(--ink)]"
            >
              ← All Monsoon Trails categories
            </Link>
          </p>
        </div>
      </section>
      <SiteFooter />
    </CuratedTrailAmbientShell>
  );
}

function MonsoonTrailDetailPage({ slug }: { slug: string }) {
  const site = getMonsoonTrailSite(slug);
  if (!site) notFound();

  const itinerary = monsoonTrailAsItinerary(site);

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient />
      <MonsoonTrailHeroSection site={site} />
      <PlaceHeroItineraryBridge currentDestination={site.title} rotationNames={MAHARASHTRA_DISTRICTS} />
      <DestinationOverviewSection
        title={site.title}
        subtitle={site.region}
        paragraphs={site.overview}
      />
      <SmartKeywordItinerary
        context="adventure"
        sectionId="monsoon-smart-itinerary"
        heading={`Plan your ${site.title} journey`}
        subheading="Pick monsoon waterfalls, drives, and treks — we'll build a personalised Monsoon Trails itinerary around the season."
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
      <DestinationGallerySection title={site.title} images={site.gallery} />
      {itinerary.days.length > 0 ? (
        <ItineraryStory
          itinerary={itinerary}
          sectionId="suggested-itinerary"
          heading="Suggested itinerary"
          sidePanel="map"
          mapPanelId="itinerary-map"
          seamlessTop
          showTalkToPlanner={false}
          plannerAnchor="#monsoon-smart-itinerary"
        />
      ) : null}
      <section className="bg-[color:var(--bone)]/40 border-t hairline py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-sm text-[color:var(--ink-soft)]">
            Part of Maharashtra&apos;s curated Monsoon Trails
          </p>
          <Link
            href="/curated-itineraries/monsoon-trails"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--saffron)] hover:underline underline-offset-4"
          >
            View all Monsoon Trails <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

export default async function MonsoonTrailPage({ params }: Props) {
  const { slug } = await params;
  if (isMonsoonCategorySlug(slug)) {
    return <MonsoonCategoryListingPage slug={slug} />;
  }
  return <MonsoonTrailDetailPage slug={slug} />;
}
