import express from 'express';
import { recordKeywordGeneration } from '../services/plannerAnalytics.js';

const router = express.Router();

/** POST /api/planner/track-generation — public; records keyword analytics */
router.post('/track-generation', async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const keywords = Array.isArray(body.keywords) ? body.keywords : [];
    const categoryFocus = (body.categoryFocus && String(body.categoryFocus)) || '';
    const categorySlug = (body.categorySlug && String(body.categorySlug)) || '';
    await recordKeywordGeneration({ keywords, categoryFocus, categorySlug });
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /planner/track-generation', err);
    res.status(500).json({ ok: false });
  }
});

export default router;
