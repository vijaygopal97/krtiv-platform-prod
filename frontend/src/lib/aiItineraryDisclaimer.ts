/** Full disclaimer for on-screen AI itinerary views. */
export const AI_ITINERARY_DISCLAIMER_TEXT =
  'This itinerary has been generated using Artificial Intelligence based on your selected preferences. It is intended as a travel suggestion and may contain inaccuracies. Please verify destination details, operating hours, availability, local conditions, and travel advisories before your trip.';

/** Short line for share text and compact contexts. */
export const AI_ITINERARY_DISCLAIMER_SHORT =
  'AI-Generated Itinerary: This travel plan was created using Artificial Intelligence based on your selections. Please verify all travel information before your journey.';

/** Saved itinerary `source` values that indicate AI planner output. */
export function isAiGeneratedItinerarySource(source?: string | null): boolean {
  if (!source) return true;
  return source === 'smart-keywords' || source === 'dashboard';
}
