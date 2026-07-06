export type ActivityStorySection = {
  heading: string;
  paragraphs: string[];
};

export type ActivityHighlight = { icon?: string; label: string; detail?: string };
export type ActivityExperience = { icon?: string; label: string; detail?: string };

/** Display label for category activity read time (UI only — content unchanged). */
export const CATEGORY_ACTIVITY_READ_TIME = '2 min read';

export type ActivityRecord = {
  slug: string;
  categoryId: string;
  title: string;
  location?: string;
  category?: string;
  readingTime?: string;
  shortDescription?: string;
  excerpt?: string;
  heroImage?: string;
  gallery?: string[];
  storySections?: ActivityStorySection[];
  highlights?: ActivityHighlight[];
  experiences?: ActivityExperience[];
  travelTips?: string[];
  travelInfo?: {
    location?: string;
    bestSeason?: string;
    duration?: string;
    idealFor?: string;
  };
  map?: { lat?: number; lng?: number; query?: string };
};

export function activityPath(slug: string) {
  return `/activities/${slug}`;
}
