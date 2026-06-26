/** Interest bubbles below the home hero — `keyword` is sent to the AI itinerary API. */
export type FloatingBubble = {
  id: string;
  emoji: string;
  label: string;
  keyword: string;
  /** Animation tuning (seconds, px) */
  floatDuration: number;
  floatDelay: number;
  driftX: number;
};

export const FLOATING_INTEREST_BUBBLES: FloatingBubble[] = [
  { id: 'heritage', emoji: '🏰', label: "Do you want to explore Maharashtra's heritage?", keyword: 'Heritage Sites', floatDuration: 14, floatDelay: 0, driftX: 12 },
  { id: 'adventure', emoji: '⛰️', label: 'Are you looking for adventure experiences?', keyword: 'Adventure Sports', floatDuration: 16, floatDelay: 0.8, driftX: -10 },
  { id: 'spiritual', emoji: '🕉️', label: 'Are you seeking a spiritual journey?', keyword: 'Pilgrimage', floatDuration: 15, floatDelay: 1.2, driftX: 8 },
  { id: 'culinary', emoji: '🍲', label: 'Would you like to discover local food?', keyword: 'Local Food', floatDuration: 17, floatDelay: 0.4, driftX: -14 },
  { id: 'art', emoji: '🎭', label: 'Are you interested in art and culture?', keyword: 'Art, Craft & Culture', floatDuration: 13, floatDelay: 1.6, driftX: 11 },
  { id: 'urban', emoji: '🌆', label: 'Do you want to explore city life?', keyword: 'Urban & Contemporary', floatDuration: 18, floatDelay: 0.2, driftX: -9 },
  { id: 'weddings', emoji: '💍', label: 'Are you planning a destination wedding?', keyword: 'Weddings', floatDuration: 15, floatDelay: 2, driftX: 7 },
  { id: 'beaches', emoji: '🏖️', label: 'Looking for the perfect beach escape?', keyword: 'Beaches', floatDuration: 14, floatDelay: 1, driftX: -12 },
  { id: 'wildlife', emoji: '🐅', label: 'Want to experience wildlife up close?', keyword: 'Wildlife', floatDuration: 16, floatDelay: 0.6, driftX: 10 },
  { id: 'photo', emoji: '📸', label: 'Interested in photography hotspots?', keyword: 'Photography', floatDuration: 19, floatDelay: 1.4, driftX: -8 },
  { id: 'road', emoji: '🚗', label: 'Ready for a memorable road trip?', keyword: 'Road Trips', floatDuration: 13, floatDelay: 0.3, driftX: 13 },
  { id: 'hills', emoji: '🌄', label: 'Looking for a peaceful hill retreat?', keyword: 'Hill Stations', floatDuration: 17, floatDelay: 1.8, driftX: -11 },
];
