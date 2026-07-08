import express from 'express';
import FeaturedCategory from '../models/FeaturedCategory.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const categories = await FeaturedCategory.find({ published: true })
      .sort({ sortOrder: 1 })
      .lean();
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    res.json({ success: true, categories });
  } catch (err) {
    console.error('GET /featured-experiences', err);
    res.status(500).json({ success: false, message: 'Could not load featured experiences' });
  }
});

export default router;
