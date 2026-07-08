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

/** Dashboard / home smart planner — compact statewide set */
export const HOME_KEYWORDS = [
  'Heritage & forts',
  'Beaches & coast',
  'Temples & ghats',
  'Wildlife & forests',
  'Hill stations',
  'Street food',
  'Weekend escapes',
  'Hidden gems',
] as const;

const CHIP_LABELS: Record<string, string> = {
  // Home / explore fallback
  'Heritage & forts': '🏰 Heritage & forts',
  'Beaches & coast': '🏖️ Beaches & coast',
  'Temples & ghats': '🛕 Temples & ghats',
  'Wildlife & forests': '🦁 Wildlife & forests',
  'Hill stations': '⛰️ Hill stations',
  'Street food': '🍲 Street food trails',
  'Weekend escapes': '🌴 Weekend escapes',
  'Hidden gems': '💎 Hidden gems',

  // Historical
  'Maratha forts': '🏰 Maratha forts',
  'UNESCO caves': '🌍 UNESCO cave art',
  'Heritage walks': '🚶 Heritage walks',
  'Ancient temples': '🛕 Ancient temples',
  'Royal palaces': '👑 Royal palaces',
  'Museum days': '🏺 Museum days',

  // Adventure
  'Sahyadri treks': '🥾 Sahyadri treks',
  'Monsoon waterfalls': '💦 Monsoon waterfalls',
  'Jungle safari': '🦁 Jungle safari',
  'Camping nights': '🏕️ Camping under stars',
  'Coastal kayaking': '🚤 Coastal kayaking',
  'Hill escapes': '⛰️ Hill escapes',

  // Spiritual
  'Jyotirlinga darshan': '🕉️ Jyotirlinga darshan',
  'Pilgrimage circuits': '🙏 Pilgrimage circuits',
  'Temple mornings': '🛕 Temple mornings',
  'Sacred river ghats': '🌊 Sacred river ghats',
  'Ashram stays': '🧘 Ashram stays',
  'Festival season': '🎉 Festival season',

  // Culinary
  'Street food trails': '🍜 Street food trails',
  'Konkan seafood': '🦐 Konkan seafood',
  'Misal & vada pav': '🌶️ Misal & vada pav',
  'Vineyard lunches': '🍷 Vineyard lunches',
  'Farm-to-table': '🌾 Farm-to-table',
  'Maharashtrian thali': '🍽️ Maharashtrian thali',

  // Art & culture
  'Folk dance & music': '💃 Folk dance & music',
  'Warli & handicrafts': '🎨 Warli & handicrafts',
  'Festival nights': '🎪 Festival nights',
  'Village performances': '🎭 Village performances',
  'Art galleries': '🖼️ Art galleries',
  'Paithani & weaving': '🧵 Paithani & weaving',

  // Urban
  'Marine Drive evenings': '🌃 Marine Drive evenings',
  'Cafe hopping': '☕ Cafe hopping',
  'Street markets': '🛍️ Street markets',
  'Art deco walks': '🏛️ Art deco walks',
  'Night markets': '✨ Night markets',
  'City food crawls': '🍽️ City food crawls',

  // Weddings
  'Palace venues': '🏰 Palace venues',
  'Beach ceremonies': '🏖️ Beach ceremonies',
  'Vineyard weddings': '🍷 Vineyard weddings',
  'Pre-wedding shoots': '📸 Pre-wedding shoots',
  'Honeymoon escapes': '💕 Honeymoon escapes',
  'Luxury resorts': '✨ Luxury resorts',
};

export const CATEGORY_KEYWORDS: Record<string, readonly string[]> = {
  historical: [
    'Maratha forts',
    'UNESCO caves',
    'Heritage walks',
    'Ancient temples',
    'Royal palaces',
    'Museum days',
  ],
  adventure: [
    'Sahyadri treks',
    'Monsoon waterfalls',
    'Jungle safari',
    'Camping nights',
    'Coastal kayaking',
    'Hill escapes',
  ],
  spiritual: [
    'Jyotirlinga darshan',
    'Pilgrimage circuits',
    'Temple mornings',
    'Sacred river ghats',
    'Ashram stays',
    'Festival season',
  ],
  culinary: [
    'Street food trails',
    'Konkan seafood',
    'Misal & vada pav',
    'Vineyard lunches',
    'Farm-to-table',
    'Maharashtrian thali',
  ],
  'art-culture': [
    'Folk dance & music',
    'Warli & handicrafts',
    'Festival nights',
    'Village performances',
    'Art galleries',
    'Paithani & weaving',
  ],
  urban: [
    'Marine Drive evenings',
    'Cafe hopping',
    'Street markets',
    'Art deco walks',
    'Night markets',
    'City food crawls',
  ],
  weddings: [
    'Palace venues',
    'Beach ceremonies',
    'Vineyard weddings',
    'Pre-wedding shoots',
    'Honeymoon escapes',
    'Luxury resorts',
  ],
};

/** Per-destination planner chips — tuned to Places to Go pages */
export const PLACE_KEYWORDS: Record<string, readonly string[]> = {
  mumbai: [
    'Gateway & Elephanta',
    'Marine Drive sunsets',
    'Street food crawl',
    'Art deco Mumbai',
    'Colaba heritage',
    'Coastal day trips',
  ],
  pune: [
    'Shaniwar Wada',
    'Sinhagad fort trek',
    'Cafe & food scene',
    'Aga Khan Palace',
    'Hill station hops',
    'Heritage lanes',
  ],
  nashik: [
    'Sula & vineyards',
    'Trimbakeshwar darshan',
    'Wine tasting',
    'Godavari ghats',
    'Grape country drives',
    'Spiritual mornings',
  ],
  'ajanta-ellora': [
    'Ajanta murals',
    'Kailasa temple',
    'Ellora caves',
    'Heritage photography',
    'Cave day trips',
    'Chhatrapati Sambhajinagar flavours',
  ],
  shirdi: [
    'Sai Baba darshan',
    'Temple mornings',
    'Peaceful pilgrimage',
    'Prasadalaya meals',
    'Nearby shrines',
    'Family devotion',
  ],
  mahabaleshwar: [
    'Strawberry farms',
    'Venna Lake',
    'Viewpoint sunsets',
    'Monsoon mist',
    'Mapro treats',
    'Forest walks',
  ],
  lonavala: [
    'Monsoon waterfalls',
    'Fort viewpoints',
    'Misty valleys',
    'Chikki & snacks',
    'Weekend escape',
    'Karla & Bhaja caves',
  ],
  alibaug: [
    'Beach afternoons',
    'Kolaba fort tide walk',
    'Seafood thali',
    'Ferry from Mumbai',
    'Coastal drives',
    'Slow Konkan pace',
  ],
  kolhapur: [
    'Mahalaxmi temple',
    'Misal & tambda',
    'Royal palace history',
    'Rankala evenings',
    'Paithani shopping',
    'Wrestling tradition',
  ],
  nagpur: [
    'Deekshabhoomi',
    'Orange country',
    'Lake sunsets',
    'Saoji spice',
    'Wildlife day trips',
    'City heritage',
  ],
  sindhudurg: [
    'Tarkarli beaches',
    'Scuba & snorkel',
    'Malvan seafood',
    'Coastal forts',
    'Houseboat stays',
    'Konkan villages',
  ],
  chandrapur: [
    'Tadoba safari',
    'Tiger tracking',
    'Forest lodges',
    'Birding trails',
    'Jungle dawn drives',
    'Wildlife photography',
  ],
};

const PLACE_CHIP_LABELS: Record<string, Record<string, string>> = {
  mumbai: {
    'Gateway & Elephanta': '🌊 Gateway & Elephanta',
    'Marine Drive sunsets': '🌅 Marine Drive sunsets',
    'Street food crawl': '🍲 Street food crawl',
    'Art deco Mumbai': '🏛️ Art deco Mumbai',
    'Colaba heritage': '🚶 Colaba heritage',
    'Coastal day trips': '⛴️ Coastal day trips',
  },
  pune: {
    'Shaniwar Wada': '🏯 Shaniwar Wada',
    'Sinhagad fort trek': '🥾 Sinhagad fort trek',
    'Cafe & food scene': '☕ Cafe & food scene',
    'Aga Khan Palace': '🌿 Aga Khan Palace',
    'Hill station hops': '⛰️ Hill station hops',
    'Heritage lanes': '🚶 Heritage lanes',
  },
  nashik: {
    'Sula & vineyards': '🍷 Sula & vineyards',
    'Trimbakeshwar darshan': '🕉️ Trimbakeshwar darshan',
    'Wine tasting': '🥂 Wine tasting',
    'Godavari ghats': '🌊 Godavari ghats',
    'Grape country drives': '🚗 Grape country drives',
    'Spiritual mornings': '🛕 Spiritual mornings',
  },
  'ajanta-ellora': {
    'Ajanta murals': '🎨 Ajanta murals',
    'Kailasa temple': '🏛️ Kailasa temple',
    'Ellora caves': '⛰️ Ellora caves',
    'Heritage photography': '📸 Heritage photography',
    'Cave day trips': '🚶 Cave day trips',
    'Chhatrapati Sambhajinagar flavours': '🍽️ Chhatrapati Sambhajinagar flavours',
  },
  shirdi: {
    'Sai Baba darshan': '🙏 Sai Baba darshan',
    'Temple mornings': '🌅 Temple mornings',
    'Peaceful pilgrimage': '✨ Peaceful pilgrimage',
    'Prasadalaya meals': '🍽️ Prasadalaya meals',
    'Nearby shrines': '🛕 Nearby shrines',
    'Family devotion': '👨‍👩‍👧 Family devotion',
  },
  mahabaleshwar: {
    'Strawberry farms': '🍓 Strawberry farms',
    'Venna Lake': '🛶 Venna Lake',
    'Viewpoint sunsets': '🌄 Viewpoint sunsets',
    'Monsoon mist': '🌧️ Monsoon mist',
    'Mapro treats': '🍫 Mapro treats',
    'Forest walks': '🌲 Forest walks',
  },
  lonavala: {
    'Monsoon waterfalls': '💦 Monsoon waterfalls',
    'Fort viewpoints': '🏰 Fort viewpoints',
    'Misty valleys': '🌫️ Misty valleys',
    'Chikki & snacks': '🍬 Chikki & snacks',
    'Weekend escape': '🌴 Weekend escape',
    'Karla & Bhaja caves': '⛰️ Karla & Bhaja caves',
  },
  alibaug: {
    'Beach afternoons': '🏖️ Beach afternoons',
    'Kolaba fort tide walk': '🏰 Kolaba fort tide walk',
    'Seafood thali': '🦐 Seafood thali',
    'Ferry from Mumbai': '⛴️ Ferry from Mumbai',
    'Coastal drives': '🚗 Coastal drives',
    'Slow Konkan pace': '🌿 Slow Konkan pace',
  },
  kolhapur: {
    'Mahalaxmi temple': '🛕 Mahalaxmi temple',
    'Misal & tambda': '🌶️ Misal & tambda',
    'Royal palace history': '👑 Royal palace history',
    'Rankala evenings': '🌅 Rankala evenings',
    'Paithani shopping': '🧵 Paithani shopping',
    'Wrestling tradition': '🤼 Wrestling tradition',
  },
  nagpur: {
    Deekshabhoomi: '🙏 Deekshabhoomi',
    'Orange country': '🍊 Orange country',
    'Lake sunsets': '🌅 Lake sunsets',
    'Saoji spice': '🌶️ Saoji spice',
    'Wildlife day trips': '🦁 Wildlife day trips',
    'City heritage': '🏛️ City heritage',
  },
  sindhudurg: {
    'Tarkarli beaches': '🏖️ Tarkarli beaches',
    'Scuba & snorkel': '🤿 Scuba & snorkel',
    'Malvan seafood': '🦐 Malvan seafood',
    'Coastal forts': '🏰 Coastal forts',
    'Houseboat stays': '🛶 Houseboat stays',
    'Konkan villages': '🌴 Konkan villages',
  },
  chandrapur: {
    'Tadoba safari': '🦁 Tadoba safari',
    'Tiger tracking': '🐅 Tiger tracking',
    'Forest lodges': '🏕️ Forest lodges',
    'Birding trails': '🦜 Birding trails',
    'Jungle dawn drives': '🌅 Jungle dawn drives',
    'Wildlife photography': '📸 Wildlife photography',
  },
};

/** Explore nav fallback when no place slug */
export const EXPLORE_KEYWORDS = HOME_KEYWORDS;

export type KeywordContext = 'home' | 'explore' | string;

export function keywordsForContext(context: KeywordContext, placeSlug?: string): readonly string[] {
  if (placeSlug && PLACE_KEYWORDS[placeSlug]) {
    return PLACE_KEYWORDS[placeSlug];
  }
  if (context === 'home' || context === 'explore') return HOME_KEYWORDS;
  return CATEGORY_KEYWORDS[context] ?? HOME_KEYWORDS;
}

export function sectionIdForPlannerContext(context: KeywordContext): string {
  if (context === 'explore') return 'explore-smart-planner';
  if (context === 'home') return 'smart-itinerary';
  if (CATEGORY_KEYWORDS[context]) return 'category-smart-itinerary';
  return 'smart-itinerary';
}

export function displayLabelForKeyword(
  context: KeywordContext,
  keyword: string,
  placeSlug?: string,
): string {
  if (placeSlug && PLACE_CHIP_LABELS[placeSlug]?.[keyword]) {
    return PLACE_CHIP_LABELS[placeSlug][keyword];
  }
  return CHIP_LABELS[keyword] ?? keyword;
}

/** Whether chips use compact single-line labels (all contexts now). */
export function usesCompactPlannerChips(_context: KeywordContext, _placeSlug?: string): boolean {
  return true;
}
