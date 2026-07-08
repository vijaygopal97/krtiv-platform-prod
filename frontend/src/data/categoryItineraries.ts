import { assetPath } from '@/lib/basePath';

export const categoryItineraries: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  days: Array<{
    day: number;
    location: string;
    image: string;
    flightInfo?: { from: string; price: string; duration: string };
    hotels?: Array<{ name: string; price: string; rating: string }>;
    activities: Array<{
      time: string;
      title: string;
      duration: string;
      description: string;
      details: string;
      icon: string;
    }>;
  }>;
}> = {
  adventure: {
    title: 'Adventure & Ecotourism',
    subtitle: '3-Day Sahyadri Adventure',
    description: "An expertly crafted expedition through Maharashtra's majestic mountain ranges",
    days: [
      {
        day: 1,
        location: 'Igatpuri',
        image: assetPath('/categories/adventure-ecotourism.jpg'),
        flightInfo: { from: 'Mumbai', price: '₹3,500', duration: '2.5 hrs' },
        hotels: [
          { name: 'Manas Lifestyle Resort', price: '₹4,500/night', rating: '4.5' },
          { name: 'Vipassana Meditation Center', price: '₹2,000/night', rating: '4.2' },
          { name: 'Rainforest Resort', price: '₹5,500/night', rating: '4.7' }
        ],
        activities: [
          { time: 'MORNING', title: 'Kalsubai Peak', duration: '5 hrs', description: 'Sunrise Trek, Rock Climbing (on iron ladders), Summit Photography, Panoramic Viewing', details: "As a solo mountain enthusiast, conquering Maharashtra's highest peak offers a challenging and rewarding start with breathtaking 360-degree views.", icon: '⛰️' },
          { time: 'AFTERNOON', title: 'Bhandardara Dam & Lake', duration: '3 hrs', description: 'Lakeside Hike, Photography, Boating (optional), Relaxing by the water', details: "Provides a serene, scenic contrast to the morning's climb, perfect for a solo traveler to unwind and reflect amidst mountain scenery.", icon: '🏞️' },
          { time: 'EVENING', title: 'Igatpuri Town', duration: '2 hrs', description: 'Local Maharashtrian Dinner, Exploring Town Vibes', details: 'A chance for the solo traveler to experience local culture and cuisine after an active day.', icon: '🌆' }
        ]
      },
      {
        day: 2,
        location: 'Malshej Ghat',
        image: 'https://images.pexels.com/photos/1531660/pexels-photo-1531660.jpeg?auto=compress&cs=tinysrgb&w=800',
        flightInfo: { from: 'Mumbai', price: '₹4,200', duration: '3 hrs' },
        hotels: [
          { name: 'Saj Resort', price: '₹6,000/night', rating: '4.6' },
          { name: 'MTDC Holiday Resort', price: '₹3,500/night', rating: '4.0' },
          { name: 'Hill View Resort', price: '₹4,800/night', rating: '4.3' }
        ],
        activities: [
          { time: 'MORNING', title: 'Harishchandragad Fort', duration: '5 hrs', description: 'Trekking, Exploring Konkan Kada (cliff), History Exploration, Landscape Photography', details: 'Offers a classic Sahyadri trek to a historic fort with dramatic cliff faces, satisfying the mountain interest with added historical depth.', icon: '🏰' },
          { time: 'AFTERNOON', title: 'Malshej Ghat Waterfalls & Viewpoints', duration: '3 hrs', description: 'Scenic Drive Stops, Waterfall Viewing, Bird Watching, Short Nature Walks', details: 'Showcases the lush, misty beauty of the Ghats with numerous vantage points ideal for a solo photographer/nature lover.', icon: '💧' },
          { time: 'EVENING', title: 'Malshej Ghat Resort Area', duration: '2 hrs', description: 'Sunset Watching, Relaxing at Accommodation', details: 'A peaceful evening in the cool mountain air, perfect for solitude and enjoying the tranquility.', icon: '🌅' }
        ]
      },
      {
        day: 3,
        location: 'Lonavala',
        image: 'https://images.pexels.com/photos/1647121/pexels-photo-1647121.jpeg?auto=compress&cs=tinysrgb&w=800',
        flightInfo: { from: 'Mumbai', price: '₹2,800', duration: '1.5 hrs' },
        hotels: [
          { name: 'The Machan', price: '₹15,000/night', rating: '4.9' },
          { name: 'Della Resorts', price: '₹8,500/night', rating: '4.5' },
          { name: 'Fariyas Resort', price: '₹6,500/night', rating: '4.4' }
        ],
        activities: [
          { time: 'MORNING', title: 'Rajmachi Fort', duration: '5 hrs', description: 'Forest Trek, Fort Exploration, Photography of Sahyadri Ranges, Visiting Shrivardhan and Manaranjan forts', details: 'A fulfilling final-day trek through dense forests to a twin-peak fort, offering a complete mountain fort experience and a sense of accomplishment.', icon: '🌲' },
          { time: 'AFTERNOON', title: 'Bhushi Dam / Lonavala Lake', duration: '2 hrs', description: 'Relaxing by Water, Light Snacks, Scenic Views', details: "A gentle, picturesque way to cool down and relax muscles after the morning trek before the journey back.", icon: '🌊' },
          { time: 'EVENING', title: 'Lonavala Market', duration: '1.5 hrs', description: 'Buying Local Chikkis (snacks), Souvenir Shopping', details: "A classic end to a Sahyadri trip, picking up mementos like chikki for the solo traveler's journey home.", icon: '🛍️' }
        ]
      }
    ]
  },
  historical: {
    title: 'Historical & Heritage',
    subtitle: '3-Day Maratha Empire Trail',
    description: 'Journey through the glorious history',
    days: [
      { day: 1, location: 'Raigad', image: assetPath('/categories/historical-heritage.jpg'),
        activities: [
          { time: 'MORNING', title: 'Raigad Fort', duration: '4 hrs', description: 'Coronation Site of Shivaji Maharaj, Palace Ruins, Ropeway Ride, Historical Monuments', details: 'Explore the capital of the Maratha Empire where Chhatrapati Shivaji Maharaj was crowned in 1674.', icon: '👑' },
          { time: 'AFTERNOON', title: 'Samadhi & Palace Complex', duration: '3 hrs', description: "Queen's Chambers, Throne Platform, Granaries, Strategic Architecture Study", details: 'Witness the architectural brilliance and strategic planning of Maratha fortifications.', icon: '🏛️' },
          { time: 'EVENING', title: 'Sunset at Maha Darwaja', duration: '2 hrs', description: 'Panoramic Views, Photography, Historical Narration', details: 'Experience the magnificent sunset from the same vantage point where Maratha kings once stood.', icon: '🌇' }
        ]
      },
      { day: 2, location: 'Pune', image: 'https://images.pexels.com/photos/15905005/pexels-photo-15905005.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Shaniwar Wada', duration: '3 hrs', description: 'Peshwa Palace, Light & Sound Show, Historical Museum, Architecture Tour', details: 'The seat of Peshwa rulers, showcasing intricate Maratha architecture and royal heritage.', icon: '🏰' },
          { time: 'AFTERNOON', title: 'Aga Khan Palace', duration: '2.5 hrs', description: 'Freedom Struggle Museum, Gandhi Memorial, Italian Architecture, Gardens', details: "A pivotal site in India's freedom movement and architectural marvel.", icon: '🕊️' },
          { time: 'EVENING', title: 'Raja Dinkar Kelkar Museum', duration: '2 hrs', description: 'Antique Collection, Artifacts, Cultural Exhibits, Traditional Crafts', details: "One of India's finest museums with over 20,000 artifacts from across the country.", icon: '🎨' }
        ]
      },
      { day: 3, location: 'Chhatrapati Sambhajinagar', image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Ajanta Caves', duration: '5 hrs', description: 'UNESCO World Heritage Site, Buddhist Rock-cut Caves, Ancient Paintings, Sculptures', details: 'Marvel at 2nd century BCE Buddhist cave monuments with exquisite paintings and sculptures.', icon: '🗿' },
          { time: 'AFTERNOON', title: 'Bibi Ka Maqbara', duration: '2 hrs', description: 'Mughal Architecture, Tomb of Rabia-ud-Daurani, Gardens, Photography', details: 'Known as the "Taj of Deccan", this stunning mausoleum mirrors the Taj Mahal.', icon: '🕌' },
          { time: 'EVENING', title: 'Panchakki & Old City', duration: '2 hrs', description: 'Water Mill, Sufi Shrine, Bazaar Walk, Traditional Himroo Shopping', details: 'Experience the engineering marvel of medieval water mill and local crafts.', icon: '⚙️' }
        ]
      }
    ]
  },
  spiritual: {
    title: 'Spiritual & Pilgrimage',
    subtitle: '3-Day Divine Maharashtra',
    description: 'Sacred journeys through ancient temples and spiritual centers',
    days: [
      { day: 1, location: 'Nashik', image: assetPath('/categories/spiritual-pilgrimage.jpg'),
        activities: [
          { time: 'MORNING', title: 'Trimbakeshwar Temple', duration: '3 hrs', description: 'One of 12 Jyotirlingas, Sacred Rituals, Godavari Origin, Temple Architecture', details: 'One of the holiest Shiva temples housing one of the twelve Jyotirlingas.', icon: '🕉️' },
          { time: 'AFTERNOON', title: 'Panchavati & Sita Gufa', duration: '3 hrs', description: 'Ramayana Trail, Holy Ghats, Ancient Temples, Godavari Aarti', details: 'Where Lord Rama spent his exile years, steeped in Ramayana mythology.', icon: '🙏' },
          { time: 'EVENING', title: 'Ram Kund', duration: '2 hrs', description: 'Holy Tank, Evening Aarti, Pilgrimage Site, Spiritual Atmosphere', details: 'Sacred bathing ghat on the Godavari, one of the holiest sites in Nashik.', icon: '💫' }
        ]
      },
      { day: 2, location: 'Shirdi', image: 'https://images.pexels.com/photos/9571408/pexels-photo-9571408.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Sai Baba Temple', duration: '4 hrs', description: 'Darshan, Samadhi Mandir, Dwarkamai, Chavadi, Museum Visit', details: "One of India's most visited temples, home to the saint Sai Baba's samadhi.", icon: '⭐' },
          { time: 'AFTERNOON', title: 'Khandoba Temple & Lendi Baug', duration: '2 hrs', description: 'Sacred Garden, Meditation, Historical Sites, Peaceful Walks', details: 'Serene garden where Sai Baba spent time in meditation and prayer.', icon: '🌿' },
          { time: 'EVENING', title: 'Shani Shingnapur', duration: '2 hrs', description: 'Temple without Roof, Shani Deity, Village Walk, Unique Architecture', details: 'Famous temple dedicated to Lord Shani with unique open-air shrine.', icon: '🪔' }
        ]
      },
      { day: 3, location: 'Ashtavinayak Circuit', image: 'https://images.pexels.com/photos/9619916/pexels-photo-9619916.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Moreshwar & Siddhivinayak', duration: '4 hrs', description: 'First & Last of Ashtavinayak, Ancient Ganesha Temples, Rituals, Sacred Ponds', details: 'Begin the holy Ashtavinayak pilgrimage circuit of eight Ganesha temples.', icon: '🐘' },
          { time: 'AFTERNOON', title: 'Mahaganapati & Chintamani', duration: '3 hrs', description: 'Temple Darshan, Offerings, Architectural Study, Spiritual Ceremonies', details: 'Continue the pilgrimage with two more revered Ganesha temples.', icon: '🛕' },
          { time: 'EVENING', title: 'Girijatmaj Temple', duration: '2 hrs', description: 'Cave Temple, Darshan, Evening Prayers, Sacred Atmosphere', details: 'Unique Ganesha temple inside a cave, marking the end of the pilgrimage day.', icon: '🕯️' }
        ]
      }
    ]
  },
  culinary: {
    title: 'Culinary & Rural',
    subtitle: '3-Day Gastronomic Journey',
    description: 'Savor authentic Maharashtrian flavors and rural life experiences',
    days: [
      { day: 1, location: 'Kolhapur', image: assetPath('/categories/culinary-rural.jpg'),
        activities: [
          { time: 'MORNING', title: 'Tambda & Pandhra Rassa Breakfast', duration: '2 hrs', description: 'Authentic Kolhapuri Cuisine, Spice Market Tour, Cooking Demonstration', details: 'Experience the fiery and aromatic Kolhapuri mutton curry, a culinary legacy.', icon: '🍛' },
          { time: 'AFTERNOON', title: 'Jaggery Village Tour', duration: '3 hrs', description: 'Sugarcane Fields, Jaggery Making Process, Farm-to-Table Experience, Rural Life', details: 'Witness traditional jaggery production and learn about organic farming methods.', icon: '🌾' },
          { time: 'EVENING', title: 'Kolhapuri Chappal & Street Food', duration: '2 hrs', description: 'Handicraft Shopping, Misal Pav, Local Snacks, Market Exploration', details: 'Taste the famous Kolhapuri Misal and shop for traditional leather chappals.', icon: '🥘' }
        ]
      },
      { day: 2, location: 'Konkan Villages', image: 'https://images.pexels.com/photos/8353766/pexels-photo-8353766.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Coastal Fishing Experience', duration: '4 hrs', description: 'Traditional Fishing, Fresh Catch Cooking, Konkan Breakfast, Beach Walk', details: 'Join local fishermen and learn traditional fishing methods, followed by a fresh seafood feast.', icon: '🎣' },
          { time: 'AFTERNOON', title: 'Alphonso Mango Orchards', duration: '3 hrs', description: 'Mango Tasting, Agritourism, Farm Lunch, Traditional Recipes', details: 'Visit the home of the world-famous Alphonso mango and taste farm-fresh varieties.', icon: '🥭' },
          { time: 'EVENING', title: 'Sol Kadhi & Kokum Workshops', duration: '2 hrs', description: 'Cooking Class, Traditional Beverages, Spice Knowledge, Recipe Exchange', details: 'Learn to make authentic Konkan refreshments and traditional coastal cuisine.', icon: '🥤' }
        ]
      },
      { day: 3, location: 'Pune Food Trail', image: 'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Traditional Breakfast Walk', duration: '3 hrs', description: 'Misal, Poha, Vada Pav, Bun Maska, Irani Chai, Heritage Eateries', details: 'Explore iconic Puneri breakfast spots and savor authentic street food.', icon: '☕' },
          { time: 'AFTERNOON', title: 'Chitale Bandhu & Bakery Tour', duration: '2.5 hrs', description: 'Famous Bakarwadi, Pedha Tasting, Baking Process, Sweet Shopping', details: 'Visit legendary sweet shops and learn the art of Maharashtrian sweets.', icon: '🍰' },
          { time: 'EVENING', title: 'Thali Experience & Cooking Class', duration: '3 hrs', description: 'Traditional Maharashtrian Thali, Hands-on Cooking, Recipe Book, Cultural Stories', details: 'Complete your culinary journey with a hands-on cooking class and royal thali.', icon: '🍽️' }
        ]
      }
    ]
  },
  'art-culture': {
    title: 'Art, Craft & Culture',
    subtitle: '3-Day Cultural Immersion',
    description: "Explore Maharashtra's rich artistic heritage and vibrant cultural traditions",
    days: [
      { day: 1, location: 'Mumbai Arts District', image: assetPath('/categories/art-craft-culture.jpg'),
        activities: [
          { time: 'MORNING', title: 'Kala Ghoda Art Precinct', duration: '3 hrs', description: 'Art Galleries, Street Art, Jehangir Art Gallery, Heritage Buildings', details: "Explore Mumbai's premier art district with world-class galleries and street installations.", icon: '🎨' },
          { time: 'AFTERNOON', title: 'Warli Art Workshop', duration: '3 hrs', description: 'Traditional Tribal Art, Hands-on Painting, Artist Interaction, Cultural Stories', details: 'Learn the ancient Warli painting technique from indigenous artists.', icon: '🖼️' },
          { time: 'EVENING', title: 'Lavani Performance', duration: '2 hrs', description: 'Traditional Dance, Live Music, Cultural Show, Storytelling', details: 'Experience the vibrant folk dance form of Maharashtra with live performance.', icon: '💃' }
        ]
      },
      { day: 2, location: 'Paithan & Chhatrapati Sambhajinagar', image: 'https://images.pexels.com/photos/6978854/pexels-photo-6978854.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Paithani Weaving Center', duration: '4 hrs', description: 'Silk Weaving, Handloom Demonstration, Saree Making, Artisan Interaction', details: 'Witness the intricate art of weaving the legendary Paithani silk sarees.', icon: '🧵' },
          { time: 'AFTERNOON', title: 'Himroo Shawl Workshop', duration: '3 hrs', description: 'Traditional Weaving, Design Process, Shopping, Cultural Heritage', details: 'Discover the 14th-century Persian weaving technique unique to Chhatrapati Sambhajinagar.', icon: '🧶' },
          { time: 'EVENING', title: 'Ellora Caves Light Show', duration: '2 hrs', description: 'Sound & Light Show, Historical Narration, Rock-cut Architecture', details: 'Experience the UNESCO World Heritage site come alive through multimedia storytelling.', icon: '🎭' }
        ]
      },
      { day: 3, location: 'Pune Cultural Hub', image: 'https://images.pexels.com/photos/6978175/pexels-photo-6978175.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Dagdusheth Halwai & Tamboo', duration: '3 hrs', description: 'Ganpati Temple, Percussion Performance, Musical Heritage, Dhol-Tasha', details: 'Experience the rhythmic traditions and temple music culture of Pune.', icon: '🥁' },
          { time: 'AFTERNOON', title: 'Pottery & Terracotta Village', duration: '3 hrs', description: 'Clay Molding, Pottery Wheel, Traditional Crafts, Artisan Village Tour', details: 'Learn traditional pottery techniques in authentic village settings.', icon: '🏺' },
          { time: 'EVENING', title: 'Marathi Theater Performance', duration: '2.5 hrs', description: 'Live Theater, Classical Performance, Cultural Center, Playwright Discussion', details: 'Attend a performance in the birthplace of modern Indian theater.', icon: '🎪' }
        ]
      }
    ]
  },
  urban: {
    title: 'Urban & Contemporary',
    subtitle: '3-Day Modern Maharashtra',
    description: 'Experience the cosmopolitan',
    days: [
      { day: 1, location: 'Mumbai Metropolis', image: assetPath('/categories/urban-contemporary.jpg'),
        activities: [
          { time: 'MORNING', title: 'Bandra-Worli Sea Link & South Bombay', duration: '3 hrs', description: 'Iconic Architecture, Marine Drive, Gateway of India, Taj Palace, Heritage Walk', details: "Discover Mumbai's architectural marvels and colonial heritage.", icon: '🌉' },
          { time: 'AFTERNOON', title: 'Bandra-Khar Cafe Culture', duration: '3 hrs', description: 'Trendy Cafes, Rooftop Bars, Street Art, Fashion District, Contemporary Food', details: "Explore Mumbai's hippest neighborhoods with artisanal coffee and modern cuisine.", icon: '☕' },
          { time: 'EVENING', title: 'Lower Parel Nightlife', duration: '3 hrs', description: 'Craft Breweries, Fine Dining, Sky Lounges, DJ Culture, Urban Experience', details: "Experience Mumbai's sophisticated nightlife in renovated mill district.", icon: '🍸' }
        ]
      },
      { day: 2, location: 'Pune Tech & Innovation', image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Koregaon Park & Osho Ashram', duration: '3 hrs', description: 'Meditation Gardens, Organic Cafes, Bookstores, Wellness Centers', details: "Explore Pune's spiritual and wellness hub with modern amenities.", icon: '🧘' },
          { time: 'AFTERNOON', title: 'Phoenix Mall & Viman Nagar', duration: '3 hrs', description: 'Shopping Centers, Multiplexes, Gaming Zones, International Cuisine', details: "Experience Pune's commercial growth and cosmopolitan lifestyle.", icon: '🏬' },
          { time: 'EVENING', title: 'Balewadi High Street', duration: '2 hrs', description: 'Sports Bars, International Restaurants, Live Music, Urban Dining', details: "Enjoy Pune's vibrant evening scene with global culinary options.", icon: '🎵' }
        ]
      },
      { day: 3, location: 'Navi Mumbai & Lavasa', image: 'https://images.pexels.com/photos/2041556/pexels-photo-2041556.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Navi Mumbai Waterfront', duration: '3 hrs', description: 'Planned City Tour, Modern Infrastructure, Palm Beach, Parks & Recreation', details: "Discover India's largest planned city with contemporary urban design.", icon: '🏙️' },
          { time: 'AFTERNOON', title: 'Lavasa Hill City', duration: '4 hrs', description: 'Italian-themed Township, Lakeside Promenade, Water Sports, Modern Resort', details: "Visit India's first planned hill city with Mediterranean architecture.", icon: '🛥️' },
          { time: 'EVENING', title: 'Sunset at Mulshi Lake', duration: '2 hrs', description: 'Lakefront Dining, Photography, Relaxation, Scenic Views', details: 'Unwind by the serene lake with contemporary dining options.', icon: '🌅' }
        ]
      }
    ]
  },
  weddings: {
    title: 'Weddings & Celebrations',
    subtitle: '3-Day Dream Wedding Planning',
    description: "Discover Maharashtra's most enchanting wedding destinations and vendors",
    days: [
      { day: 1, location: 'Udaipur-style Palace Venues', image: assetPath('/categories/weddings.jpg'),
        activities: [
          { time: 'MORNING', title: 'Heritage Palace Tours', duration: '4 hrs', description: 'Royal Venues, Venue Site Visits, Capacity Assessment, Decor Possibilities', details: "Tour Maharashtra's grandest palaces and heritage hotels for wedding ceremonies.", icon: '👰' },
          { time: 'AFTERNOON', title: 'Vendor Meetings', duration: '3 hrs', description: 'Decorators, Caterers, Planners, Photographers, Entertainment Artists', details: 'Meet top wedding vendors and explore traditional Maharashtrian wedding elements.', icon: '💐' },
          { time: 'EVENING', title: 'Venue Dinner Experience', duration: '2 hrs', description: 'Sample Menus, Ambiance Testing, Lighting Assessment, Layout Planning', details: 'Experience a curated dinner to assess catering quality and venue atmosphere.', icon: '🕯️' }
        ]
      },
      { day: 2, location: 'Lonavala Hill Resorts', image: 'https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Resort & Lawn Venues', duration: '3 hrs', description: 'Garden Weddings, Mountain Backdrops, Luxury Resorts, Accommodation Options', details: 'Explore scenic hill station venues perfect for destination weddings.', icon: '🏞️' },
          { time: 'AFTERNOON', title: 'Traditional Maharashtrian Wedding', duration: '3 hrs', description: 'Costume Trials, Jewelry Shopping, Nauvari Saree, Mundavalya, Wedding Rituals', details: 'Experience authentic Maharashtrian wedding attire and customs.', icon: '💍' },
          { time: 'EVENING', title: 'Sangeet Venue Setup', duration: '2 hrs', description: 'Dance Floor, Stage Design, DJ & Band Options, Entertainment Planning', details: 'Plan pre-wedding celebrations with professional entertainment options.', icon: '🎊' }
        ]
      },
      { day: 3, location: 'Alibaug Beach Venues', image: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800',
        activities: [
          { time: 'MORNING', title: 'Beach Wedding Venues', duration: '4 hrs', description: 'Beachfront Properties, Villa Complexes, Intimate Settings, Sunset Ceremony Spots', details: 'Discover stunning beach venues for romantic coastal weddings.', icon: '🏖️' },
          { time: 'AFTERNOON', title: 'Wedding Photoshoot Locations', duration: '3 hrs', description: 'Fort Backdrops, Beach Shoots, Vintage Settings, Natural Scenery', details: 'Scout picturesque locations for pre-wedding and wedding day photography.', icon: '📸' },
          { time: 'EVENING', title: 'Full Wedding Mock Setup', duration: '3 hrs', description: 'Mandap Design, Floral Arrangements, Lighting Demo, Complete Setup Walkthrough', details: 'View a complete wedding setup with traditional and modern elements.', icon: '✨' }
        ]
      }
    ]
  }
};
