import Link from 'next/link';
import { headers, cookies } from 'next/headers';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { HeroSection } from '@/components/krtiv/HeroSection';
import { CategoryHeroVideo } from '@/components/krtiv/CategoryHeroVideo';
import { ItineraryStory } from '@/components/krtiv/ItineraryStory';
import { MaharashtraMap } from '@/components/krtiv/MaharashtraMap';
import { CategoryShowcase } from '@/components/krtiv/CategoryShowcase';
import { CtaBandInteractive } from '@/components/krtiv/CtaBandInteractive';
import { getItinerary, type CategoryItinerary } from '@/components/krtiv/data';
import PersistPreferredLang from '@/components/PersistPreferredLang';
import {
  getCategoryApiName,
  getBestVideo,
  getBestItinerary,
  CATEGORY_SLUG_TO_IMAGE,
  EMPTY_VIDEO_ENGAGEMENT,
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

  let bestVideo: Awaited<ReturnType<typeof getBestVideo>> = null;
  try {
    bestVideo = categoryApiName ? await getBestVideo(categoryApiName, preferredLanguage) : null;
  } catch {
    bestVideo = null;
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

  const heroTitle = `Experience ${staticItinerary.title} Tourism in Maharashtra`;

  let videoSlot = null;
  if (bestVideo?.url) {
    const pathOk = Boolean(bestVideo.videoPath && String(bestVideo.videoPath).trim());
    if (bestVideo.threadId && pathOk) {
      videoSlot = (
        <CategoryHeroVideo
          kind="signpost"
          defaultThumbnail={categoryImage}
          video={{
            ...bestVideo,
            videoPath: String(bestVideo.videoPath).trim(),
            engagement: bestVideo.engagement ?? EMPTY_VIDEO_ENGAGEMENT,
            heroTitle,
          }}
        />
      );
    } else {
      videoSlot = (
        <CategoryHeroVideo
          kind="url"
          url={bestVideo.url}
          title={heroTitle}
          defaultThumbnail={categoryImage}
        />
      );
    }
  }

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <PersistPreferredLang lang={preferredLanguage} shouldPersist={!fromCookie} />
      <SiteHeaderClient />
      <HeroSection
        eyebrow={staticItinerary.title}
        title={staticItinerary.subtitle}
        subtitle={staticItinerary.description}
        image={categoryImage}
        primaryHref="/#itinerary-generator"
        primaryLabel="Plan with AI"
        secondaryHref="#itinerary"
        secondaryLabel="Read the itinerary"
        videoTitle={heroTitle}
        videoMeta="Featured"
        videoPoster={categoryImage}
        exploreHref="#itinerary"
        exploreLabel="Explore itinerary"
        videoSlot={videoSlot}
      />
      <ItineraryStory itinerary={itineraryForStory} />
      <MaharashtraMap itinerary={itineraryForStory} />
      <CategoryShowcase />
      <CtaBandInteractive />
      <SiteFooter />
    </main>
  );
}
