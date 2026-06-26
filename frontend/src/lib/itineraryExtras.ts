/** Pull labeled smart-planner sections from raw itinerary LLM text. */
export function extractItineraryExtras(raw: string) {
  const pick = (label: string) => {
    const re = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z][A-Z0-9_]+:|$)`, 'i');
    const m = raw.match(re);
    return m?.[1]?.trim() || '';
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
