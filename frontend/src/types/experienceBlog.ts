export type FeaturedActivity = {
  title: string;
  blogSlug: string;
  sortOrder?: number;
};

export type FeaturedCategory = {
  _id?: string;
  slug: string;
  title: string;
  description?: string;
  coverImage?: string;
  exploreHref?: string;
  activities: FeaturedActivity[];
  published?: boolean;
  sortOrder?: number;
};

export type ExperienceBlogListItem = {
  slug: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  overview?: string;
};

export type ExperienceBlogRecord = {
  slug: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  overview?: string;
  whyVisit?: string;
  bestTimeToVisit?: string;
  thingsToDo?: { label: string; detail?: string }[];
  nearbyAttractions?: { slug: string; title: string; image?: string }[];
  howToReach?: string;
  travelTips?: string[];
  gallery?: string[];
  map?: { lat?: number; lng?: number; query?: string };
  relatedSlugs?: string[];
  categoryTags?: string[];
  published?: boolean;
  sortOrder?: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
};
