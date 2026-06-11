import express from 'express';
import HeroSlide from '../models/HeroSlide.js';

const router = express.Router();

const HOME_SLIDES = [
  {
    scope: 'home',
    imageUrl: '/categories/explorer/home-1.jpg',
    alt: 'A hill fort silhouette at sunrise over the Sahyadris',
    focalX: 55,
    focalY: 60,
    kicker: 'Maharashtra · Sahyadris',
    title: 'Forts that wake before the sun',
    sortOrder: 0,
  },
  {
    scope: 'home',
    imageUrl: '/categories/explorer/historical.jpg',
    alt: 'Stone walls of an ancient Maratha fort in golden light',
    focalX: 70,
    focalY: 55,
    kicker: 'Maratha Empire · Western Deccan',
    title: 'A history you can put your hand on',
    sortOrder: 1,
  },
  {
    scope: 'home',
    imageUrl: '/categories/explorer/adventure.jpg',
    alt: 'Misty Sahyadri waterfall in monsoon',
    focalX: 50,
    focalY: 55,
    kicker: 'Sahyadris · Monsoon',
    title: 'Mountains that move you',
    sortOrder: 2,
  },
  {
    scope: 'home',
    imageUrl: '/categories/explorer/home-3.jpg',
    alt: 'Konkan coast at golden hour with fishing boats',
    focalX: 50,
    focalY: 65,
    kicker: 'Konkan · Arabian Sea',
    title: 'A coastline written in gold',
    sortOrder: 3,
  },
  {
    scope: 'home',
    imageUrl: '/categories/explorer/home-2.jpg',
    alt: "Marine Drive Mumbai at blue hour, Queen's Necklace lights",
    focalX: 65,
    focalY: 60,
    kicker: 'Mumbai · Blue hour',
    title: 'A city that glows past midnight',
    sortOrder: 4,
  },
];

const CATEGORY_SLIDES = {
  historical: [
    { imageUrl: '/categories/explorer/historical.jpg', alt: 'Maratha fort walls at dawn', focalX: 70, focalY: 55, kicker: 'Maratha Empire', title: 'Heritage fort', sortOrder: 0 },
    { imageUrl: '/categories/explorer/home-1.jpg', alt: 'Hill fort silhouette over Sahyadris', focalX: 55, focalY: 60, kicker: 'Western Deccan', title: 'Sahyadri forts', sortOrder: 1 },
    { imageUrl: '/categories/historical-heritage.jpg', alt: 'Ellora Caves heritage', focalX: 70, focalY: 55, kicker: 'Ellora · Aurangabad', title: 'Living heritage', sortOrder: 2 },
  ],
  spiritual: [
    { imageUrl: '/categories/explorer/spiritual.jpg', alt: 'Temple at twilight with oil lamps', focalX: 50, focalY: 55, kicker: 'Sacred Maharashtra', title: 'Temple trail', sortOrder: 0 },
    { imageUrl: '/categories/explorer/home-1.jpg', alt: 'Sahyadri mountain temple at dawn', focalX: 55, focalY: 60, kicker: 'Pilgrimage trail', title: 'Mountain shrines', sortOrder: 1 },
    { imageUrl: '/categories/spiritual-pilgrimage.jpg', alt: 'Spiritual pilgrimage', focalX: 50, focalY: 55, kicker: 'Sacred routes', title: 'Pilgrimage', sortOrder: 2 },
  ],
  adventure: [
    { imageUrl: '/categories/explorer/adventure.jpg', alt: 'Sahyadri waterfall in monsoon cloud', focalX: 50, focalY: 55, kicker: 'Sahyadris · Monsoon', title: 'Waterfall trek', sortOrder: 0 },
    { imageUrl: '/categories/explorer/home-1.jpg', alt: 'Maratha fort over rolling hills', focalX: 55, focalY: 55, kicker: 'Trek · Climb', title: 'Fort trek', sortOrder: 1 },
    { imageUrl: '/categories/adventure-ecotourism.jpg', alt: 'Adventure and ecotourism', focalX: 50, focalY: 55, kicker: 'Wild Maharashtra', title: 'Ecotourism', sortOrder: 2 },
  ],
  culinary: [
    { imageUrl: '/categories/explorer/culinary.jpg', alt: 'Maharashtrian thali on banana leaf', focalX: 50, focalY: 55, kicker: 'Coast to plateau', title: 'Regional thali', sortOrder: 0 },
    { imageUrl: '/categories/explorer/home-3.jpg', alt: 'Konkan coast where the seafood begins', focalX: 50, focalY: 60, kicker: 'Konkan kitchens', title: 'Coastal cuisine', sortOrder: 1 },
    { imageUrl: '/categories/culinary-rural.jpg', alt: 'Maharashtrian thali', focalX: 50, focalY: 55, kicker: 'Farmhouse tables', title: 'Rural culinary', sortOrder: 2 },
  ],
  'art-culture': [
    { imageUrl: '/categories/explorer/art-culture.jpg', alt: 'Warli tribal painting on a mud wall', focalX: 55, focalY: 50, kicker: 'Living traditions', title: 'Warli art', sortOrder: 0 },
    { imageUrl: '/categories/explorer/weddings.jpg', alt: 'Marigold garlands and brass lamps', focalX: 50, focalY: 60, kicker: 'Festival color', title: 'Celebration craft', sortOrder: 1 },
    { imageUrl: '/categories/art-craft-culture.jpg', alt: 'Art craft and culture', focalX: 55, focalY: 50, kicker: 'Handmade Maharashtra', title: 'Art & craft', sortOrder: 2 },
  ],
  urban: [
    { imageUrl: '/categories/explorer/urban.jpg', alt: 'Mumbai sea link with light trails at night', focalX: 55, focalY: 55, kicker: 'Mumbai · Bandra-Worli', title: 'Sea link nights', sortOrder: 0 },
    { imageUrl: '/categories/explorer/home-2.jpg', alt: 'Marine Drive at blue hour', focalX: 65, focalY: 60, kicker: "Queen's Necklace", title: 'Marine Drive', sortOrder: 1 },
    { imageUrl: '/categories/urban-contemporary.jpg', alt: 'Urban contemporary Maharashtra', focalX: 55, focalY: 55, kicker: 'City lights', title: 'Urban life', sortOrder: 2 },
  ],
  weddings: [
    { imageUrl: '/categories/explorer/weddings.jpg', alt: 'Marigold wedding mandap with brass lamps', focalX: 50, focalY: 55, kicker: 'Once-in-a-lifetime', title: 'Wedding mandap', sortOrder: 0 },
    { imageUrl: '/categories/explorer/home-3.jpg', alt: 'Konkan beachfront at golden hour', focalX: 50, focalY: 65, kicker: 'Sea-cliff venues', title: 'Coastal vows', sortOrder: 1 },
    { imageUrl: '/categories/weddings.jpg', alt: 'Maharashtra wedding venues', focalX: 50, focalY: 55, kicker: 'Palace lawns', title: 'Wedding venues', sortOrder: 2 },
  ],
};

function allDefaultSlides() {
  const out = [...HOME_SLIDES];
  for (const [scope, slides] of Object.entries(CATEGORY_SLIDES)) {
    slides.forEach((s) => out.push({ ...s, scope }));
  }
  return out;
}

async function ensureDefaultSlides(scope) {
  const count = await HeroSlide.countDocuments({ scope });
  if (count > 0) return;
  if (scope === 'home') {
    await HeroSlide.insertMany(HOME_SLIDES);
    return;
  }
  const catSlides = CATEGORY_SLIDES[scope];
  if (catSlides) {
    await HeroSlide.insertMany(catSlides.map((s) => ({ ...s, scope })));
  }
}

router.get('/', async (req, res) => {
  try {
    const scope = String(req.query.scope || 'home').trim();
    await ensureDefaultSlides(scope);
    const slides = await HeroSlide.find({ active: true, scope }).sort({ sortOrder: 1, createdAt: 1 });
    res.json({ success: true, scope, slides });
  } catch (err) {
    console.error('Public hero slides:', err);
    res.status(500).json({ success: false, message: 'Failed to load hero slides' });
  }
});

export { allDefaultSlides, HOME_SLIDES, CATEGORY_SLIDES };
export default router;
