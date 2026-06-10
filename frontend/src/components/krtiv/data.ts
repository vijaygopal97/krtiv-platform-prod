// Framework-agnostic data shared by the redesigned visitor pages.
// Mirrors src/data/categoryItineraries.ts contract so the Next.js
// production build can plug into the real SignPost API unchanged.

import { categoryImage } from '@/lib/krtivPaths';

export type Activity = {
  time: string;
  title: string;
  duration: string;
  description: string;
  details: string;
  icon: string;
};

export type Day = {
  day: number;
  location: string;
  image: string;
  activities: Activity[];
};

export type CategoryItinerary = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  hero: string;
  accent: string;
  region: string;
  days: Day[];
};

export const CATEGORIES = [
  {
    slug: "historical",
    title: "Historical & Heritage",
    short: "Forts, palaces and the Maratha legacy",
    image: categoryImage('historical-heritage.jpg'),
    accent: "Heritage",
  },
  {
    slug: "spiritual",
    title: "Spiritual & Pilgrimage",
    short: "Ancient temples and sacred trails",
    image: categoryImage('spiritual-pilgrimage.jpg'),
    accent: "Pilgrimage",
  },
  {
    slug: "adventure",
    title: "Adventure & Ecotourism",
    short: "Sahyadri treks, waterfalls and wild coasts",
    image: categoryImage('adventure-ecotourism.jpg'),
    accent: "Adventure",
  },
  {
    slug: "culinary",
    title: "Culinary & Rural",
    short: "Coastal kitchens and village tables",
    image: categoryImage('culinary-rural.jpg'),
    accent: "Culinary",
  },
  {
    slug: "art-culture",
    title: "Art, Craft & Culture",
    short: "Warli, weaves and living traditions",
    image: categoryImage('art-craft-culture.jpg'),
    accent: "Culture",
  },
  {
    slug: "urban",
    title: "Urban & Contemporary",
    short: "Mumbai modern, Pune nights",
    image: categoryImage('urban-contemporary.jpg'),
    accent: "Cities",
  },
  {
    slug: "weddings",
    title: "Weddings",
    short: "Heirloom venues for once-in-a-lifetime days",
    image: categoryImage('weddings.jpg'),
    accent: "Celebrations",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

const day = (
  n: number,
  location: string,
  image: string,
  activities: Activity[],
): Day => ({ day: n, location, image, activities });

export const CATEGORY_ITINERARIES: Record<string, CategoryItinerary> = {
  adventure: {
    slug: "adventure",
    title: "Adventure & Ecotourism",
    subtitle: "Three days across the Sahyadris",
    description:
      "An expertly paced expedition through Maharashtra's mountain ranges — from Maharashtra's highest peak to a mist-bound ghat to a forest fort above Lonavala.",
    hero: categoryImage('adventure-ecotourism.jpg'),
    accent: "Adventure",
    region: "Sahyadri Range",
    days: [
      day(1, "Igatpuri", categoryImage('adventure-ecotourism.jpg'), [
        { time: "Morning", title: "Kalsubai Peak", duration: "5 hrs", description: "Sunrise trek, iron-ladder ascent, summit photography", details: "Conquer Maharashtra's highest peak as the valley opens beneath you.", icon: "▲" },
        { time: "Afternoon", title: "Bhandardara Dam & Lake", duration: "3 hrs", description: "Lakeside hike, optional boating, slow photography", details: "A serene counterpoint to the morning climb, framed by mountain silhouettes.", icon: "◆" },
        { time: "Evening", title: "Igatpuri Town", duration: "2 hrs", description: "Local Maharashtrian dinner, town wander", details: "Wind down with the day's first warm meal and easy conversation.", icon: "●" },
      ]),
      day(2, "Malshej Ghat", "https://images.pexels.com/photos/1531660/pexels-photo-1531660.jpeg?auto=compress&cs=tinysrgb&w=1600", [
        { time: "Morning", title: "Harishchandragad Fort", duration: "5 hrs", description: "Trek, Konkan Kada cliff, landscape photography", details: "A classic Sahyadri trek to a historic fort with theatrical cliff faces.", icon: "▲" },
        { time: "Afternoon", title: "Malshej Waterfalls", duration: "3 hrs", description: "Scenic drive, waterfall stops, bird watching", details: "Lush, misty pockets of the Ghats made for slow looking.", icon: "◆" },
        { time: "Evening", title: "Resort Belvedere", duration: "2 hrs", description: "Sunset, quiet, mountain air", details: "A peaceful evening in cool air — read, breathe, reset.", icon: "●" },
      ]),
      day(3, "Lonavala", "https://images.pexels.com/photos/1647121/pexels-photo-1647121.jpeg?auto=compress&cs=tinysrgb&w=1600", [
        { time: "Morning", title: "Rajmachi Fort", duration: "5 hrs", description: "Forest trek, twin-peak fort, panoramic views", details: "Dense forests open onto a twin-peak fort and the day's most rewarding vista.", icon: "▲" },
        { time: "Afternoon", title: "Bhushi Dam", duration: "2 hrs", description: "Water, light snacks, slow afternoon", details: "Cool off and let the legs recover before the drive back.", icon: "◆" },
        { time: "Evening", title: "Lonavala Market", duration: "1.5 hrs", description: "Chikki, souvenirs, last light", details: "End the trip the local way: a paper bag of chikki and a long exhale.", icon: "●" },
      ]),
    ],
  },
  historical: {
    slug: "historical",
    title: "Historical & Heritage",
    subtitle: "Three days on the Maratha Empire trail",
    description:
      "From Shivaji Maharaj's coronation hill to the rock-cut wonder of Ajanta, an architectural read of an empire and the centuries that shaped it.",
    hero: categoryImage('historical-heritage.jpg'),
    accent: "Heritage",
    region: "Western Deccan",
    days: [
      day(1, "Raigad", categoryImage('historical-heritage.jpg'), [
        { time: "Morning", title: "Raigad Fort", duration: "4 hrs", description: "Coronation site, palace ruins, ropeway", details: "Walk the capital of the Maratha Empire, crowned in 1674.", icon: "▲" },
        { time: "Afternoon", title: "Palace Complex", duration: "3 hrs", description: "Queen's chambers, throne platform, granaries", details: "Read the strategic intelligence of Maratha fortification first-hand.", icon: "◆" },
        { time: "Evening", title: "Maha Darwaja Sunset", duration: "2 hrs", description: "Panoramic views, photography, history", details: "Take in the same vantage that once received returning kings.", icon: "●" },
      ]),
      day(2, "Pune", "https://images.pexels.com/photos/15905005/pexels-photo-15905005.jpeg?auto=compress&cs=tinysrgb&w=1600", [
        { time: "Morning", title: "Shaniwar Wada", duration: "3 hrs", description: "Peshwa palace, light & sound show, museum", details: "Seat of the Peshwas, with intricate Maratha architecture intact.", icon: "▲" },
        { time: "Afternoon", title: "Aga Khan Palace", duration: "2.5 hrs", description: "Freedom struggle museum, gardens", details: "A pivotal site in India's freedom movement, in unexpected Italianate.", icon: "◆" },
        { time: "Evening", title: "Raja Dinkar Kelkar Museum", duration: "2 hrs", description: "20,000+ artifacts, traditional crafts", details: "One of India's finest object museums — every cabinet is a story.", icon: "●" },
      ]),
      day(3, "Aurangabad", "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1600", [
        { time: "Morning", title: "Ajanta Caves", duration: "5 hrs", description: "UNESCO Buddhist caves, ancient paintings", details: "2nd-century BCE rock-cut viharas with sculpture and pigment intact.", icon: "▲" },
        { time: "Afternoon", title: "Bibi Ka Maqbara", duration: "2 hrs", description: "Mughal architecture, gardens", details: "The 'Taj of the Deccan' in soft Aurangabad light.", icon: "◆" },
        { time: "Evening", title: "Panchakki & Old City", duration: "2 hrs", description: "Medieval water mill, bazaar, Himroo cloth", details: "Quiet engineering marvel followed by a slow market walk.", icon: "●" },
      ]),
    ],
  },
  spiritual: {
    slug: "spiritual",
    title: "Spiritual & Pilgrimage",
    subtitle: "Three days through divine Maharashtra",
    description:
      "Sacred geography from Nashik's Jyotirlinga to Shirdi's Sai Baba — a journey of temples, ghats and quiet hours.",
    hero: categoryImage('spiritual-pilgrimage.jpg'),
    accent: "Pilgrimage",
    region: "Northern Maharashtra",
    days: [
      day(1, "Nashik", categoryImage('spiritual-pilgrimage.jpg'), [
        { time: "Morning", title: "Trimbakeshwar Temple", duration: "3 hrs", description: "Jyotirlinga, rituals, Godavari origin", details: "One of twelve Jyotirlingas — the holiest of Shiva shrines.", icon: "▲" },
        { time: "Afternoon", title: "Panchavati & Sita Gufa", duration: "3 hrs", description: "Ramayana trail, ghats, ancient temples", details: "Where Lord Rama's exile years are etched into the landscape.", icon: "◆" },
        { time: "Evening", title: "Ram Kund Aarti", duration: "2 hrs", description: "Holy tank, evening aarti, atmosphere", details: "A sacred bathing ghat that softens into lamplight after dusk.", icon: "●" },
      ]),
      day(2, "Shirdi", "https://images.pexels.com/photos/9571408/pexels-photo-9571408.jpeg?auto=compress&cs=tinysrgb&w=1600", [
        { time: "Morning", title: "Sai Baba Temple", duration: "4 hrs", description: "Darshan, Samadhi Mandir, Dwarkamai", details: "One of India's most-visited temples, home to Sai Baba's samadhi.", icon: "▲" },
        { time: "Afternoon", title: "Khandoba Mandir", duration: "2 hrs", description: "Hilltop temple, photography, blessings", details: "Quieter than the main complex, with a long view back to Shirdi.", icon: "◆" },
        { time: "Evening", title: "Lendi Garden", duration: "1.5 hrs", description: "Meditation, peaceful walk", details: "Sai Baba's chosen garden — slow loops between flowering trees.", icon: "●" },
      ]),
      day(3, "Bhimashankar", "https://images.pexels.com/photos/2417726/pexels-photo-2417726.jpeg?auto=compress&cs=tinysrgb&w=1600", [
        { time: "Morning", title: "Bhimashankar Jyotirlinga", duration: "3 hrs", description: "Sacred temple, wildlife sanctuary", details: "Sixth of the twelve Jyotirlingas, set inside a misty sanctuary.", icon: "▲" },
        { time: "Afternoon", title: "Sanctuary Walk", duration: "2 hrs", description: "Trail, endemic squirrel, birdwatching", details: "Look for the endangered Indian giant squirrel between cedar shadows.", icon: "◆" },
        { time: "Evening", title: "Hanuman Lake", duration: "1 hr", description: "Sunset reflections, last quiet hour", details: "Close the journey with still water and a long last look.", icon: "●" },
      ]),
    ],
  },
  culinary: {
    slug: "culinary",
    title: "Culinary & Rural",
    subtitle: "Three days at the village table",
    description:
      "Coastal kitchens, ghat-side farmhouses and family recipes — Maharashtra eaten in the order it was always meant to be.",
    hero: categoryImage('culinary-rural.jpg'),
    accent: "Culinary",
    region: "Konkan Coast",
    days: [
      day(1, "Alibaug", categoryImage('culinary-rural.jpg'), [
        { time: "Morning", title: "Konkan Breakfast", duration: "2 hrs", description: "Ghavan, chutney, fresh kokum", details: "Begin with rice pancakes, coconut chutney and a glass of ruby kokum.", icon: "▲" },
        { time: "Afternoon", title: "Fishing Village Tour", duration: "3 hrs", description: "Boat ride, market, lunch with a family", details: "A working morning at sea ends at a family table set for guests.", icon: "◆" },
        { time: "Evening", title: "Beach Shack Dinner", duration: "2 hrs", description: "Surmai fry, sol kadhi, sunset", details: "Whole-fish, ginger-tempered curry, a horizon turning gold.", icon: "●" },
      ]),
      day(2, "Mahabaleshwar", "https://images.pexels.com/photos/616401/pexels-photo-616401.jpeg?auto=compress&cs=tinysrgb&w=1600", [
        { time: "Morning", title: "Strawberry Farm", duration: "2 hrs", description: "Pick-your-own, jam workshop", details: "Walk fragrant rows and learn the slow art of jam-making.", icon: "▲" },
        { time: "Afternoon", title: "Mapro Garden", duration: "2 hrs", description: "Tasting flight, garden lunch", details: "A long, leisurely tasting through everything Mahabaleshwar grows.", icon: "◆" },
        { time: "Evening", title: "Wilson Point", duration: "1.5 hrs", description: "Sunset, hot bhajiya, masala chai", details: "The day's highest viewpoint, with a paper cone of fried snacks.", icon: "●" },
      ]),
      day(3, "Kolhapur", "https://images.pexels.com/photos/1893555/pexels-photo-1893555.jpeg?auto=compress&cs=tinysrgb&w=1600", [
        { time: "Morning", title: "Misal Pav at Bawda", duration: "1.5 hrs", description: "Signature breakfast, local chai", details: "Eat misal where the city eats it — fiery, layered, unforgettable.", icon: "▲" },
        { time: "Afternoon", title: "Tambda & Pandhra Rassa Lunch", duration: "2.5 hrs", description: "Twin-curry mutton, jowar bhakri", details: "The defining Kolhapuri pairing in its city of origin.", icon: "◆" },
        { time: "Evening", title: "Mahalakshmi Temple & Market", duration: "2 hrs", description: "Temple, jaggery, kolhapuri chappal", details: "Blessings, then a slow loop through artisan stalls.", icon: "●" },
      ]),
    ],
  },
  "art-culture": {
    slug: "art-culture",
    title: "Art, Craft & Culture",
    subtitle: "Three days inside living traditions",
    description:
      "Warli walls, Paithani looms and the long quiet rooms of Mumbai's museums — Maharashtra at the workbench.",
    hero: categoryImage('art-craft-culture.jpg'),
    accent: "Culture",
    region: "Statewide",
    days: [
      day(1, "Mumbai", categoryImage('art-craft-culture.jpg'), [
        { time: "Morning", title: "CSMVS Museum", duration: "3 hrs", description: "Decorative arts, miniature paintings", details: "Begin with the state's most considered curatorial voice.", icon: "▲" },
        { time: "Afternoon", title: "Kala Ghoda Walk", duration: "2 hrs", description: "Galleries, bookshops, street art", details: "Mumbai's art district at a walker's pace.", icon: "◆" },
        { time: "Evening", title: "NCPA Performance", duration: "2 hrs", description: "Classical music or theatre", details: "Close the day in the city's quietest, most attentive room.", icon: "●" },
      ]),
      day(2, "Paithan", categoryImage('art-craft-culture.jpg'), [
        { time: "Morning", title: "Paithani Weaver Studio", duration: "3 hrs", description: "Loom visit, motif language, conversation", details: "Watch a saree take a month to become itself.", icon: "▲" },
        { time: "Afternoon", title: "Sant Eknath Sansthan", duration: "2 hrs", description: "Temple, ghats, river quiet", details: "Riverside calm and the saint-poet's legacy.", icon: "◆" },
        { time: "Evening", title: "Jayakwadi Dam", duration: "1.5 hrs", description: "Bird sanctuary, last light", details: "Migratory flocks lift across the water as the sky shifts.", icon: "●" },
      ]),
      day(3, "Warli Country", categoryImage('art-craft-culture.jpg'), [
        { time: "Morning", title: "Warli Painting Workshop", duration: "3 hrs", description: "Tribal art, motifs, hands-on session", details: "Learn the geometry of a 2,500-year-old visual language.", icon: "▲" },
        { time: "Afternoon", title: "Tribal Village Visit", duration: "2.5 hrs", description: "Community lunch, conversation", details: "Sit with the families who keep this work alive.", icon: "◆" },
        { time: "Evening", title: "Craft Bazaar", duration: "1.5 hrs", description: "Direct-from-maker shopping", details: "Take home a piece with a name attached.", icon: "●" },
      ]),
    ],
  },
  urban: {
    slug: "urban",
    title: "Urban & Contemporary",
    subtitle: "Three days of city Maharashtra",
    description:
      "Mumbai mornings, Pune cafés and the quiet design districts in between — the state's contemporary pulse.",
    hero: categoryImage('urban-contemporary.jpg'),
    accent: "Cities",
    region: "Mumbai · Pune · Nagpur",
    days: [
      day(1, "Mumbai", categoryImage('urban-contemporary.jpg'), [
        { time: "Morning", title: "Gateway & Colaba", duration: "3 hrs", description: "Architecture walk, café stop", details: "The city's most photographed mile, read for its architecture.", icon: "▲" },
        { time: "Afternoon", title: "BKC & Jio World", duration: "3 hrs", description: "Design district, gallery, lunch", details: "New Mumbai — clean lines, sharp light, careful coffee.", icon: "◆" },
        { time: "Evening", title: "Bandra Bandstand", duration: "2 hrs", description: "Sea promenade, dinner, music", details: "The sea on one side, a city of fifty years on the other.", icon: "●" },
      ]),
      day(2, "Pune", "https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1600", [
        { time: "Morning", title: "Koregaon Park Cafés", duration: "2 hrs", description: "Specialty coffee, brunch, slow read", details: "The most considered coffee in the state, served slowly.", icon: "▲" },
        { time: "Afternoon", title: "Aga Khan + Osho Park", duration: "3 hrs", description: "History, gardens, design district", details: "A long afternoon that moves from monument to garden to street.", icon: "◆" },
        { time: "Evening", title: "FC Road", duration: "2 hrs", description: "Student energy, street food, music", details: "Pune at full volume — the city's clearest evening flavor.", icon: "●" },
      ]),
      day(3, "Nagpur", "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1600", [
        { time: "Morning", title: "Deekshabhoomi", duration: "2 hrs", description: "Architecture, history, quiet hour", details: "The largest hollow stupa in the world, in the city's morning light.", icon: "▲" },
        { time: "Afternoon", title: "Orange Country", duration: "3 hrs", description: "Farm visit, tasting, slow drive", details: "Drive into the groves and learn the city's most famous export.", icon: "◆" },
        { time: "Evening", title: "Futala Lake", duration: "1.5 hrs", description: "Musical fountain, street food", details: "Close with the city's favorite evening walk.", icon: "●" },
      ]),
    ],
  },
  weddings: {
    slug: "weddings",
    title: "Weddings",
    subtitle: "Three days of venue stories",
    description:
      "Heirloom palaces, vineyard lawns and seaside terraces — sketch the once-in-a-lifetime day across Maharashtra's most enduring places.",
    hero: categoryImage('weddings.jpg'),
    accent: "Celebrations",
    region: "Statewide",
    days: [
      day(1, "Udaipur of the East — Aurangabad", categoryImage('weddings.jpg'), [
        { time: "Morning", title: "Palace Venue Tour", duration: "3 hrs", description: "Heirloom suites, ballroom, gardens", details: "Begin with a palace built for ceremony.", icon: "▲" },
        { time: "Afternoon", title: "Bibi Ka Maqbara at Dusk", duration: "2 hrs", description: "Photography, location scouting", details: "The 'Taj of the Deccan' as a portrait backdrop.", icon: "◆" },
        { time: "Evening", title: "Curated Tasting", duration: "2 hrs", description: "Marathwada cuisine flight", details: "Sample the regional menu your guests will remember.", icon: "●" },
      ]),
      day(2, "Nashik Vineyards", categoryImage('weddings.jpg'), [
        { time: "Morning", title: "Sula Vineyards", duration: "3 hrs", description: "Lawn venue, sunset terrace", details: "India's wine capital, with vineyard lawns built for ceremonies.", icon: "▲" },
        { time: "Afternoon", title: "Boutique Estate Visit", duration: "2 hrs", description: "Private estate, tasting, planner meeting", details: "Smaller, quieter, more bespoke alternatives.", icon: "◆" },
        { time: "Evening", title: "Vineyard Dinner", duration: "2 hrs", description: "Outdoor table, fairy lights", details: "The sketch of a future welcome dinner, tonight.", icon: "●" },
      ]),
      day(3, "Alibaug Coast", categoryImage('weddings.jpg'), [
        { time: "Morning", title: "Beachfront Villa", duration: "3 hrs", description: "Seaside venue, mandap orientation", details: "Whitewashed villa, soft sand, and the ocean as the third guest.", icon: "▲" },
        { time: "Afternoon", title: "Floral & Decor Studio", duration: "2 hrs", description: "Mood-board session, design walk", details: "Build the palette in person, with the makers.", icon: "◆" },
        { time: "Evening", title: "Sunset Cruise", duration: "1.5 hrs", description: "Boat ride, fireworks demo", details: "Close the trip the way the wedding might.", icon: "●" },
      ]),
    ],
  },
};

export function getItinerary(slug: string): CategoryItinerary | undefined {
  return CATEGORY_ITINERARIES[slug];
}
