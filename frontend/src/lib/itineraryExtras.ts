import { ITINERARY_EXTRA_SECTION_KEYS } from '@/lib/parseItinerary';

const EXTRA_LABEL_ALT = ITINERARY_EXTRA_SECTION_KEYS.join('|');

/**
 * Pull labeled smart-planner sections from raw itinerary LLM text.
 * Handles both newline-separated sections and labels glued onto the last day line.
 */
export function extractItineraryExtras(raw: string) {
  const text = typeof raw === 'string' ? raw : '';

  const pick = (label: string) => {
    // Stop at the next known supplement label (with or without a preceding newline)
    const re = new RegExp(
      `${label}:\\s*([\\s\\S]*?)(?=(?:\\s|\\n)(?:${EXTRA_LABEL_ALT}):|\\n---|(?:\\n)?===MASTER_OUTPUT_END===|$)`,
      'i',
    );
    const m = text.match(re);
    return (m?.[1] || '').trim();
  };

  return {
    foodRecommendations: pick('FOOD_RECOMMENDATIONS'),
    travelTips: pick('TRAVEL_TIPS'),
    bestTimeToVisit: pick('BEST_TIME_TO_VISIT'),
    estimatedBudget: pick('ESTIMATED_BUDGET'),
    nearbyPlaces: pick('NEARBY_PLACES'),
    relatedDestinations: pick('RELATED_DESTINATIONS'),
    similarExperiences: pick('SIMILAR_EXPERIENCES'),
    hiddenGems: pick('HIDDEN_GEMS'),
  };
}

export type ItineraryExtras = ReturnType<typeof extractItineraryExtras>;
