import Link from 'next/link';
import { headers, cookies } from 'next/headers';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { CategoryHeroSection } from '@/components/krtiv/CategoryHeroSection';
import { PlaceHeroItineraryBridge } from '@/components/krtiv/PlaceHeroItineraryBridge';
import { ItineraryStory } from '@/components/krtiv/ItineraryStory';
import { CategoryShowcase } from '@/components/krtiv/CategoryShowcase';
import { CategoryActivitiesSection } from '@/components/activities/CategoryActivitiesSection';
import { getActivitiesForCategory } from '@/data/categoryActivities';
import { CtaBandInteractive } from '@/components/krtiv/CtaBandInteractive';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import { getItinerary, type CategoryItinerary } from '@/components/krtiv/data';
import PersistPreferredLang from '@/components/PersistPreferredLang';
import {
  getCategoryApiName,
  getBestItinerary,
  CATEGORY_SLUG_TO_IMAGE,
} from '@/lib/signpostApi';
import { parsePreferredLangCookie, getPreferredLanguage, PREFERRED_LANG_COOKIE, type VideoLanguage } from '@/lib/geo';
import { parseItineraryText, parsedToTimelineDays } from '@/lib/parseItinerary';
import { assetPath } from '@/lib/basePath';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const it = getItinerary(category);
  return {
    title: it ? `${it.title} — Maharashtra Tourism` : 'Category — Maharashtra Tourism',
    description: it?.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const staticItinerary = getItinerary(category);

  if (!staticItinerary) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[color:var(--ivory)]">
        <div className="text-center px-6">
          <h1 className="display-md text-[color:var(--ink)] mb-4">Category Not Found</h1>
          <p className="lede">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="mt-6 inline-block text-[color:var(--saffron)] font-semibold hover:underline">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const categoryApiName = getCategoryApiName(category);
  const categoryImage = CATEGORY_SLUG_TO_IMAGE[category] ?? staticItinerary.hero ?? assetPath('/hero-image.jpeg');

  let preferredLanguage: VideoLanguage = 'en';
  let fromCookie = false;
  let bestItinerary: Awaited<ReturnType<typeof getBestItinerary>> = null;

  try {
    let headersList: Awaited<ReturnType<typeof headers>> | null = null;
    let cookieLang: ReturnType<typeof parsePreferredLangCookie> = null;
    try {
      headersList = await headers();
    } catch {
      headersList = null;
    }
    try {
      const cookieStore = await cookies();
      const cookieValue = cookieStore?.get?.(PREFERRED_LANG_COOKIE)?.value;
      cookieLang = parsePreferredLangCookie(cookieValue);
    } catch {
      cookieLang = null;
    }

    const [preferredResult, itineraryResult] = await Promise.all([
      getPreferredLanguage(headersList, cookieLang),
      categoryApiName ? getBestItinerary(categoryApiName) : Promise.resolve(null),
    ]);
    preferredLanguage = preferredResult.lang;
    fromCookie = preferredResult.fromCookie;
    bestItinerary = itineraryResult;
  } catch {
    preferredLanguage = 'en';
    fromCookie = false;
    bestItinerary = categoryApiName ? await getBestItinerary(categoryApiName).catch(() => null) : null;
  }

  let itineraryForStory: CategoryItinerary = { ...staticItinerary, hero: categoryImage };

  if (bestItinerary?.itinerary) {
    try {
      const parsed = parseItineraryText(bestItinerary.itinerary);
      const dayImages = (parsed.days ?? []).map(() => categoryImage);
      const days = parsedToTimelineDays(parsed, dayImages);
      if (days.length > 0) {
        itineraryForStory = {
          ...staticItinerary,
          hero: categoryImage,
          subtitle: parsed.theme || staticItinerary.subtitle,
          description: parsed.region || staticItinerary.description,
          region: parsed.region || staticItinerary.region,
          days: days.map((d) => ({
            day: d.day,
            location: d.location,
            image: d.image,
            activities: d.activities.map((a) => ({
              time: a.time,
              title: a.title,
              duration: a.duration,
              description: a.description,
              details: a.details,
              icon: a.icon,
            })),
          })),
        };
      }
    } catch {
      // keep static itinerary
    }
  }

  const plannerHeading =
    category === 'historical'
      ? 'Plan Your Historical & Heritage Journey'
      : category === 'adventure'
        ? 'Plan Your Adventure & Ecotourism Journey'
      : `Plan your ${staticItinerary.title} journey`;
  const plannerSubheading =
    category === 'historical'
      ? 'Pick the heritage experiences you want — we’ll build a day-by-day route through Maharashtra’s forts, caves, and living history.'
      : category === 'adventure'
        ? 'Choose what kind of adventure you’re after — treks, safaris, waterfalls, or hill escapes tailored to you.'
        : 'Tap the interests that match your trip — we’ll craft a personalised itinerary for this theme.';

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <PersistPreferredLang lang={preferredLanguage} shouldPersist={!fromCookie} />
      <SiteHeaderClient />
      <CategoryHeroSection
        category={category}
        eyebrow={staticItinerary.title}
        title={staticItinerary.subtitle}
        subtitle={staticItinerary.description}
        image={categoryImage}
        primaryHref="#category-smart-itinerary"
        primaryLabel="Generate itinerary"
        secondaryHref="#itinerary-map"
        secondaryLabel="See the map"
      />
      <PlaceHeroItineraryBridge currentDestination={staticItinerary.title} />
      <SmartKeywordItinerary
        context={category}
        heading={plannerHeading}
        subheading={plannerSubheading}
        className="bg-white border-b hairline"
        compact
      />
      <ItineraryStory
        itinerary={itineraryForStory}
        sidePanel="map"
        mapPanelId="itinerary-map"
      />
      <CategoryActivitiesSection activities={getActivitiesForCategory(category)} />
      <CategoryShowcase showPlanner={false} />
      <CtaBandInteractive />
      <SiteFooter />
    </main>
  );
}
