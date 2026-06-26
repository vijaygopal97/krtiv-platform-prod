import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { PlaceHeroSection } from '@/components/krtiv/PlaceHeroSection';
import { PlaceHeroItineraryBridge } from '@/components/krtiv/PlaceHeroItineraryBridge';
import { ItineraryStory } from '@/components/krtiv/ItineraryStory';
import { PlaceDestinationExtras } from '@/components/krtiv/PlaceDestinationExtras';
import { getDestination, allDestinationSlugs } from '@/data/destinations';
import { PLACES_TO_GO_LABEL } from '@/lib/siteNavigation';
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
    title: `${place.title} — ${PLACES_TO_GO_LABEL} — Maharashtra Tourism`,
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
      <nav
        className="relative z-[1] px-4 sm:px-6 md:px-10 py-2 text-xs sm:text-[12px] text-[color:var(--ink-soft)] max-w-[1440px] mx-auto bg-[color:var(--ivory)]"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap gap-x-2 gap-y-1 items-center">
          <li>
            <Link href="/" className="hover:text-[color:var(--saffron)]">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/places-to-go" className="hover:text-[color:var(--saffron)]">
              {PLACES_TO_GO_LABEL}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-[color:var(--ink)]">{place.title}</li>
        </ol>
      </nav>
      <ItineraryStory
        itinerary={place}
        sectionId="suggested-itinerary"
        heading="Suggested 3-day itinerary"
        sidePanel="map"
        mapPanelId="itinerary-map"
        seamlessTop
      />
      <PlaceDestinationExtras place={place} />
      <SiteFooter />
    </main>
  );
}
