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
    { imageUrl: '/categories/slides/historical/ellora-kailasa.jpg', alt: 'Kailasa Temple, Ellora Caves', focalX: 55, focalY: 50, kicker: 'Ellora · Aurangabad', title: 'Rock-cut marvel', sortOrder: 0 },
    { imageUrl: '/categories/slides/historical/ajanta-aerial.jpg', alt: 'Ajanta Caves aerial view, Maharashtra', focalX: 50, focalY: 45, kicker: 'Ajanta · UNESCO', title: 'Cave heritage', sortOrder: 1 },
    { imageUrl: '/places/slides/ajanta-ellora/ellora-caves.jpg', alt: 'Ellora Caves, Aurangabad', focalX: 55, focalY: 50, kicker: 'Ellora', title: 'Ancient Deccan', sortOrder: 2 },
    { imageUrl: '/places/slides/ajanta-ellora/ellora-detail.jpg', alt: 'Rock-cut sculptures, Ellora', focalX: 55, focalY: 48, kicker: 'Ellora', title: 'Sculpted heritage', sortOrder: 3 },
    { imageUrl: '/places/slides/pune/shaniwar-wada.jpg', alt: 'Shaniwar Wada, Pune', focalX: 50, focalY: 50, kicker: 'Pune', title: 'Maratha heritage', sortOrder: 4 },
  ],
  spiritual: [
    { imageUrl: '/places/slides/nashik/trimbakeshwar.jpg', alt: 'Trimbakeshwar Temple, Nashik', focalX: 50, focalY: 48, kicker: 'Nashik · Godavari', title: 'Trimbakeshwar', sortOrder: 0 },
    { imageUrl: '/places/slides/kolhapur/mahalaxmi-temple.jpg', alt: 'Mahalaxmi Temple, Kolhapur', focalX: 50, focalY: 50, kicker: 'Kolhapur', title: 'Mahalaxmi shrine', sortOrder: 1 },
    { imageUrl: '/places/slides/nagpur/deekshabhoomi.jpg', alt: 'Deekshabhoomi, Nagpur', focalX: 50, focalY: 45, kicker: 'Nagpur', title: 'Deekshabhoomi', sortOrder: 2 },
    { imageUrl: '/places/slides/mahabaleshwar/temple.jpg', alt: 'Mahabaleshwar Temple', focalX: 50, focalY: 50, kicker: 'Mahabaleshwar', title: 'Sacred hills', sortOrder: 3 },
    { imageUrl: '/places/slides/nagpur/dragon-palace.jpg', alt: 'Dragon Palace Temple, Nagpur', focalX: 50, focalY: 48, kicker: 'Nagpur', title: 'Buddhist shrine', sortOrder: 4 },
  ],
  adventure: [
    { imageUrl: '/categories/slides/adventure/jeep-safari.jpg', alt: 'Open jeep safari, Tadoba', focalX: 55, focalY: 50, kicker: 'Tadoba · Chandrapur', title: 'Tiger safari', sortOrder: 0 },
    { imageUrl: '/places/slides/chandrapur/tiger-tadoba.jpg', alt: 'Bengal tiger, Tadoba Andhari Reserve', focalX: 55, focalY: 50, kicker: 'Tadoba', title: 'Wild Maharashtra', sortOrder: 1 },
    { imageUrl: '/places/slides/lonavala/lonavala-hills.jpg', alt: 'Lonavala hills and valleys', focalX: 50, focalY: 55, kicker: 'Lonavala', title: 'Hill trek', sortOrder: 2 },
    { imageUrl: '/places/slides/mahabaleshwar/hills.jpg', alt: 'Sahyadri hills, Mahabaleshwar', focalX: 50, focalY: 55, kicker: 'Mahabaleshwar', title: 'Western Ghats', sortOrder: 3 },
    { imageUrl: '/places/slides/lonavala/matheran.jpg', alt: 'Matheran hill station', focalX: 50, focalY: 55, kicker: 'Matheran', title: 'Monsoon trails', sortOrder: 4 },
  ],
  culinary: [
    { imageUrl: '/places/slides/nashik/vineyard.jpg', alt: 'Vineyards of Nashik', focalX: 50, focalY: 55, kicker: 'Nashik', title: 'Wine country', sortOrder: 0 },
    { imageUrl: '/places/slides/kolhapur/mahalaxmi-temple.jpg', alt: 'Kolhapur — city of culture and cuisine', focalX: 50, focalY: 50, kicker: 'Kolhapur', title: 'Spice country', sortOrder: 1 },
    { imageUrl: '/places/slides/alibaug/dive-agar-beach.jpg', alt: 'Dive Agar Beach, Konkan coast', focalX: 50, focalY: 60, kicker: 'Konkan kitchens', title: 'Coastal cuisine', sortOrder: 2 },
    { imageUrl: '/places/slides/kolhapur/rankala-lake.jpg', alt: 'Rankala Lake, Kolhapur', focalX: 50, focalY: 55, kicker: 'Kolhapur', title: 'Plateau flavours', sortOrder: 3 },
    { imageUrl: '/places/slides/sindhudurg/kunkeshwar.jpg', alt: 'Kunkeshwar Temple beach, Konkan', focalX: 50, focalY: 58, kicker: 'Konkan coast', title: 'Seafood trail', sortOrder: 4 },
  ],
  'art-culture': [
    { imageUrl: '/places/slides/ajanta-ellora/ellora-detail.jpg', alt: 'Rock-cut sculptures, Ellora', focalX: 55, focalY: 48, kicker: 'Ellora', title: 'Sculpted heritage', sortOrder: 0 },
    { imageUrl: '/places/slides/pune/aga-khan-palace.jpg', alt: 'Aga Khan Palace, Pune', focalX: 50, focalY: 50, kicker: 'Pune', title: 'Colonial heritage', sortOrder: 1 },
    { imageUrl: '/places/slides/pune/shaniwar-wada.jpg', alt: 'Shaniwar Wada, Pune', focalX: 50, focalY: 50, kicker: 'Pune', title: 'Maratha architecture', sortOrder: 2 },
    { imageUrl: '/places/slides/ajanta-ellora/ajanta-aerial.jpg', alt: 'Ajanta Caves aerial view', focalX: 50, focalY: 45, kicker: 'Ajanta', title: 'Cave art', sortOrder: 3 },
    { imageUrl: '/places/slides/lonavala/karla-caves.jpg', alt: 'Karla Caves, Lonavala', focalX: 50, focalY: 50, kicker: 'Lonavala', title: 'Rock-cut caves', sortOrder: 4 },
  ],
  urban: [
    { imageUrl: '/categories/slides/urban/gateway-of-india.jpg', alt: 'Gateway of India, Mumbai', focalX: 50, focalY: 50, kicker: 'Mumbai', title: 'Gateway of India', sortOrder: 0 },
    { imageUrl: '/categories/slides/urban/cst-mumbai.jpg', alt: 'Chhatrapati Shivaji Maharaj Terminus, Mumbai', focalX: 55, focalY: 48, kicker: 'Mumbai', title: 'Victorian Gothic', sortOrder: 1 },
    { imageUrl: '/places/slides/mumbai/elephanta-caves.jpg', alt: 'Elephanta Caves, Mumbai Harbour', focalX: 50, focalY: 50, kicker: 'Mumbai Harbour', title: 'Island heritage', sortOrder: 2 },
    { imageUrl: '/places/slides/mumbai/cst-mumbai.jpg', alt: 'CSMT illuminated at night, Mumbai', focalX: 55, focalY: 48, kicker: 'Mumbai', title: 'City nights', sortOrder: 3 },
    { imageUrl: '/places/slides/mumbai/gateway-of-india.jpg', alt: 'Gateway of India waterfront, Mumbai', focalX: 50, focalY: 50, kicker: 'Mumbai', title: 'Harbour front', sortOrder: 4 },
  ],
  weddings: [
    { imageUrl: '/places/slides/alibaug/anjarle-beach.jpg', alt: 'Anjarle Beach, Konkan', focalX: 50, focalY: 60, kicker: 'Konkan coast', title: 'Beachfront vows', sortOrder: 0 },
    { imageUrl: '/places/slides/alibaug/dive-agar-beach.jpg', alt: 'Dive Agar Beach, Konkan', focalX: 50, focalY: 60, kicker: 'Raigad coast', title: 'Coastal mandap', sortOrder: 1 },
    { imageUrl: '/places/slides/mahabaleshwar/hills.jpg', alt: 'Hill resort backdrop, Mahabaleshwar', focalX: 50, focalY: 55, kicker: 'Mahabaleshwar', title: 'Hill country venues', sortOrder: 2 },
    { imageUrl: '/places/slides/alibaug/murud-janjira.jpg', alt: 'Murud Janjira Fort, Raigad', focalX: 50, focalY: 55, kicker: 'Murud', title: 'Fort backdrop', sortOrder: 3 },
    { imageUrl: '/places/slides/sindhudurg/houseboat.jpg', alt: 'Houseboat, Tarkarli backwaters', focalX: 50, focalY: 55, kicker: 'Tarkarli', title: 'Backwater celebrations', sortOrder: 4 },
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

/** POST /api/hero-slides/track — public hero banner metrics */
router.post('/track', async (req, res) => {
  try {
    const slideId = req.body?.slideId;
    const event = req.body?.event === 'click' ? 'click' : 'impression';
    if (!slideId) {
      return res.status(400).json({ success: false, message: 'slideId required' });
    }
    const inc = event === 'click' ? { clicks: 1 } : { impressions: 1 };
    await HeroSlide.findByIdAndUpdate(slideId, { $inc: inc });
    res.json({ success: true });
  } catch (err) {
    console.error('Hero track:', err);
    res.status(500).json({ success: false, message: 'Track failed' });
  }
});

export { allDefaultSlides, HOME_SLIDES, CATEGORY_SLIDES };
export default router;
