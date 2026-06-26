import express from 'express';
import HeroPageVideo from '../models/HeroPageVideo.js';
import { resolveHeroVideoForScope } from '../lib/heroVideoDefaults.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const scope = String(req.query.scope || 'home').trim();
    const doc = await HeroPageVideo.findOne({ scope }).lean();
    const resolved = resolveHeroVideoForScope(scope, doc);
    res.json({ success: true, ...resolved });
  } catch (err) {
    console.error('Public hero video:', err);
    res.status(500).json({ success: false, message: 'Failed to load hero video' });
  }
});

export default router;
