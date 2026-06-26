/** Shown on the home hero (includes words from the hero subtitle + full planner set). */
export const HOME_HERO_KEYWORDS = [
  'Forts',
  'Ghats',
  'Coasts',
  'Villages',
  'Beaches',
  'Temples',
  'Wildlife',
  'Waterfalls',
  'Road Trips',
  'Hill Stations',
  'Heritage Sites',
  'Photography',
  'Family Trips',
  'Luxury Travel',
  'Weekend Getaways',
  'Adventure Sports',
  'Local Food',
  'Hidden Gems',
] as const;

export const HOME_KEYWORDS = [
  'Forts',
  'Beaches',
  'Temples',
  'Wildlife',
  'Waterfalls',
  'Road Trips',
  'Hill Stations',
  'Heritage Sites',
  'Photography',
  'Family Trips',
  'Luxury Travel',
  'Weekend Getaways',
  'Adventure Sports',
  'Local Food',
  'Hidden Gems',
] as const;

export const CATEGORY_KEYWORDS: Record<string, readonly string[]> = {
  historical: [
    'Maratha Empire',
    'Forts',
    'Ancient Temples',
    'UNESCO Sites',
    'Architecture',
    'Historical Walks',
    'Museums',
    'Ancient Caves',
    'Cultural Heritage',
    'Royal History',
  ],
  adventure: [
    'Trekking',
    'Hiking',
    'Camping',
    'Rock Climbing',
    'Water Sports',
    'Jungle Safari',
    'Cycling',
    'Road Trips',
    'Mountain Exploration',
    'Offbeat Adventure',
  ],
  spiritual: [
    'Temples',
    'Jyotirlingas',
    'Pilgrimage',
    'Meditation',
    'Ashrams',
    'Sacred Rivers',
    'Spiritual Retreats',
    'Religious Tourism',
    'Ancient Traditions',
    'Festivals',
  ],
  culinary: [
    'Street Food',
    'Maharashtrian Cuisine',
    'Seafood',
    'Local Restaurants',
    'Traditional Sweets',
    'Food Trails',
    'Vegetarian Cuisine',
    'Regional Delicacies',
    'Culinary Experiences',
    'Fine Dining',
  ],
  'art-culture': [
    'Folk Arts',
    'Dance',
    'Music',
    'Festivals',
    'Handicrafts',
    'Traditional Performances',
    'Art Galleries',
    'Cultural Heritage',
    'Theatre',
    'Local Artists',
  ],
  urban: [
    'City Tours',
    'Modern Attractions',
    'Shopping',
    'Nightlife',
    'Business Travel',
    'Cafes',
    'Architecture',
    'Urban Culture',
    'Entertainment',
    'Local Experiences',
  ],
  weddings: [
    'Destination Weddings',
    'Palace Weddings',
    'Beach Weddings',
    'Luxury Resorts',
    'Wedding Photography',
    'Pre-Wedding Shoots',
    'Honeymoon',
    'Wedding Venues',
    'Cultural Weddings',
    'Luxury Experiences',
  ],
};

/** Explore nav / explore-by-categories — statewide interest tags */
export const EXPLORE_KEYWORDS = HOME_KEYWORDS;

/** Display labels for Explore planner chips (keeps backend keywords unchanged). */
export const EXPLORE_KEYWORD_LABELS: Partial<Record<(typeof HOME_KEYWORDS)[number], string>> = {
  'Heritage Sites': '🏰 Would you like to explore historic forts and heritage sites?',
  Beaches: '🏖️ Are you looking for beautiful beaches and coastal escapes?',
  Temples: '🛕 Would you like to visit famous temples and pilgrimage sites?',
  Wildlife: '🦁 Are you interested in wildlife and nature experiences?',
  Waterfalls: '💦 Do you want to discover scenic waterfalls?',
  'Road Trips': '🚗 Are you planning a memorable road trip?',
  'Hill Stations': '⛰️ Would you like to visit peaceful hill stations?',
  Photography: '📸 Are you looking for photography-worthy destinations?',
  'Family Trips': '👨‍👩‍👧‍👦 Are you planning a family-friendly vacation?',
  'Luxury Travel': '✨ Would you like a luxury travel experience?',
  'Weekend Getaways': '🌴 Are you looking for a relaxing weekend getaway?',
  'Adventure Sports': '🥾 Do you enjoy adventure sports and outdoor activities?',
  'Local Food': '🍲 Would you like to discover authentic local food?',
  'Hidden Gems': '💎 Are you interested in exploring hidden gems?',
};

/** Display labels for Historical category planner chips (logic still uses raw keywords). */
export const HISTORICAL_KEYWORD_LABELS: Record<string, string> = {
  'Maratha Empire': '🏰 Would you like to explore the legacy of the Maratha Empire?',
  Forts: '🏯 Are you interested in visiting historic forts and citadels?',
  'Ancient Temples': '🛕 Would you like to discover ancient temples and sacred architecture?',
  'UNESCO Sites': '🌍 Do you want to explore UNESCO World Heritage Sites?',
  Architecture: '🏛️ Are you fascinated by historic architecture and craftsmanship?',
  'Historical Walks': '🚶 Would you enjoy guided historical walks through heritage towns?',
  Museums: '🏺 Are you interested in museums and cultural collections?',
  'Ancient Caves': '⛰️ Would you like to explore ancient caves and rock-cut monuments?',
  'Cultural Heritage': "🎭 Are you interested in Maharashtra's cultural heritage and traditions?",
  'Royal History': '👑 Would you like to learn about royal history and legendary rulers?',
};

/** Display labels for Adventure category planner chips (logic still uses raw keywords). */
export const ADVENTURE_KEYWORD_LABELS: Record<string, string> = {
  Trekking: "🥾 Would you like to explore Maharashtra's best trekking trails?",
  Hiking: '🚶 Are you looking for scenic hiking experiences?',
  Camping: '🏕️ Would you enjoy camping in nature and under the stars?',
  'Rock Climbing': '🧗 Are you interested in rock climbing and outdoor challenges?',
  'Water Sports': '🚤 Would you like to experience thrilling water sports?',
  'Jungle Safari': '🦁 Are you excited to explore wildlife through jungle safaris?',
  Cycling: '🚴 Would you enjoy cycling through scenic landscapes?',
  'Road Trips': '🚗 Are you planning an adventurous road trip?',
  'Mountain Exploration': '⛰️ Would you like to discover hidden mountain destinations?',
  'Offbeat Adventure': '🌿 Are you looking for unique offbeat adventure experiences?',
};

export const SPIRITUAL_KEYWORD_LABELS: Record<string, string> = {
  Temples: "🛕 Would you like to visit Maharashtra's most sacred temples?",
  Jyotirlingas: '🕉️ Are you interested in exploring the Jyotirlingas?',
  Pilgrimage: '🙏 Would you like to experience a spiritual pilgrimage journey?',
  Meditation: '🧘 Are you looking for meditation and inner peace experiences?',
  Ashrams: '🌿 Would you like to stay in traditional ashrams?',
  'Sacred Rivers': '🌊 Are you interested in visiting sacred rivers and ghats?',
  'Spiritual Retreats': '✨ Would you enjoy a spiritual retreat and wellness escape?',
  'Religious Tourism': '📿 Are you interested in religious tourism and holy destinations?',
  'Ancient Traditions': '🏛️ Would you like to discover ancient spiritual traditions?',
  Festivals: '🎉 Are you interested in experiencing religious festivals and celebrations?',
};

export const CULINARY_KEYWORD_LABELS: Record<string, string> = {
  'Street Food': "🍜 Would you like to discover Maharashtra's best street food?",
  'Maharashtrian Cuisine': '🍲 Are you interested in authentic Maharashtrian cuisine?',
  Seafood: '🦐 Would you like to enjoy fresh coastal seafood experiences?',
  'Local Restaurants': '🍽️ Are you looking for highly recommended local restaurants?',
  'Traditional Sweets': '🍬 Would you like to taste traditional Maharashtrian sweets?',
  'Food Trails': '🚶 Are you interested in guided food trails and culinary walks?',
  'Vegetarian Cuisine': '🥗 Would you like to explore vegetarian food experiences?',
  'Regional Delicacies': '🌶️ Are you interested in regional delicacies and local flavors?',
  'Culinary Experiences': '👨‍🍳 Would you enjoy immersive culinary experiences?',
  'Fine Dining': '✨ Are you looking for premium fine dining experiences?',
};

export const ART_CULTURE_KEYWORD_LABELS: Record<string, string> = {
  'Folk Arts': "🎭 Would you like to experience Maharashtra's folk arts?",
  Dance: '💃 Are you interested in traditional dance performances?',
  Music: '🎵 Would you like to explore local music and cultural traditions?',
  Festivals: '🎉 Are you interested in cultural festivals and celebrations?',
  Handicrafts: '🧵 Would you like to discover traditional handicrafts?',
  'Traditional Performances': '🎪 Are you interested in live cultural performances?',
  'Art Galleries': '🖼️ Would you like to visit art galleries and exhibitions?',
  'Cultural Heritage': "🏛️ Are you interested in Maharashtra's cultural heritage?",
  Theatre: '🎬 Would you enjoy theatre and performing arts experiences?',
  'Local Artists': '🎨 Would you like to meet local artists and creative communities?',
};

export const URBAN_KEYWORD_LABELS: Record<string, string> = {
  'City Tours': '🏙️ Would you like to explore the best city tours?',
  'Modern Attractions': '✨ Are you interested in modern attractions and landmarks?',
  Shopping: '🛍️ Would you enjoy shopping and lifestyle experiences?',
  Nightlife: '🌃 Are you looking for vibrant nightlife and entertainment?',
  'Business Travel': '💼 Are you traveling for business or professional events?',
  Cafes: '☕ Would you like to discover unique cafes and social spaces?',
  Architecture: '🏛️ Are you interested in contemporary architecture and design?',
  'Urban Culture': '🎭 Would you like to experience urban culture and creativity?',
  Entertainment: '🎬 Are you looking for entertainment and leisure activities?',
  'Local Experiences': '📍 Would you like to discover authentic local city experiences?',
};

export const WEDDINGS_KEYWORD_LABELS: Record<string, string> = {
  'Destination Weddings': '💍 Are you planning a destination wedding in Maharashtra?',
  'Palace Weddings': '🏰 Would you like a royal palace wedding experience?',
  'Beach Weddings': '🏖️ Are you dreaming of a beachside wedding celebration?',
  'Luxury Resorts': '✨ Are you looking for luxury resort wedding venues?',
  'Wedding Photography': '📸 Would you like professional wedding photography locations?',
  'Pre-Wedding Shoots': '🎬 Are you planning memorable pre-wedding shoots?',
  Honeymoon: '💕 Are you looking for the perfect honeymoon destination?',
  'Wedding Venues': '🏛️ Would you like to explore unique wedding venues?',
  'Cultural Weddings': '🎊 Are you interested in traditional cultural wedding experiences?',
  'Luxury Experiences': '🌟 Would you like a luxury wedding and hospitality experience?',
};

export type KeywordContext = 'home' | 'explore' | string;

export function keywordsForContext(context: KeywordContext): readonly string[] {
  if (context === 'home' || context === 'explore') return HOME_KEYWORDS;
  return CATEGORY_KEYWORDS[context] ?? HOME_KEYWORDS;
}

export function sectionIdForPlannerContext(context: KeywordContext): string {
  if (context === 'explore') return 'explore-smart-planner';
  if (context === 'home') return 'smart-itinerary';
  if (CATEGORY_KEYWORDS[context]) return 'category-smart-itinerary';
  return 'smart-itinerary';
}

export function displayLabelForKeyword(context: KeywordContext, keyword: string): string {
  if (context === 'explore') {
    return EXPLORE_KEYWORD_LABELS[keyword as keyof typeof EXPLORE_KEYWORD_LABELS] ?? keyword;
  }
  if (context === 'historical') {
    return HISTORICAL_KEYWORD_LABELS[keyword] ?? keyword;
  }
  if (context === 'adventure') {
    return ADVENTURE_KEYWORD_LABELS[keyword] ?? keyword;
  }
  if (context === 'spiritual') {
    return SPIRITUAL_KEYWORD_LABELS[keyword] ?? keyword;
  }
  if (context === 'culinary') {
    return CULINARY_KEYWORD_LABELS[keyword] ?? keyword;
  }
  if (context === 'art-culture') {
    return ART_CULTURE_KEYWORD_LABELS[keyword] ?? keyword;
  }
  if (context === 'urban') {
    return URBAN_KEYWORD_LABELS[keyword] ?? keyword;
  }
  if (context === 'weddings') {
    return WEDDINGS_KEYWORD_LABELS[keyword] ?? keyword;
  }
  return keyword;
}
