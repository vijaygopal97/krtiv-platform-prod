import express from 'express';
import Journey from '../models/Journey.js';
import Content from '../models/Content.js';
import { applyJourneyContentOverrides, journeyCardFromDoc } from '../services/journeyMerge.js';

const router = express.Router();

async function loadJourneyWithCms(slug) {
  const journey = await Journey.findOne({ slug }).lean();
  if (!journey) return null;
  const prefix = `journey.${slug}.`;
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rows = await Content.find({ cmsKey: { $regex: `^${escaped}` } }).lean();
  return applyJourneyContentOverrides(journey, rows);
}

router.get('/', async (_req, res) => {
  try {
    const journeys = await Journey.find().sort({ sortOrder: 1 }).lean();
    const cards = journeys.map(journeyCardFromDoc);
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    res.json({ success: true, journeys: cards });
  } catch (err) {
    console.error('GET /journeys', err);
    res.status(500).json({ success: false, message: 'Could not load journeys' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const doc = await loadJourneyWithCms(req.params.slug);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Journey not found' });
    }
    const related = await Journey.find({ slug: { $ne: doc.slug } })
      .sort({ sortOrder: 1 })
      .limit(3)
      .lean();
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    res.json({
      success: true,
      journey: doc,
      related: related.map(journeyCardFromDoc),
    });
  } catch (err) {
    console.error('GET /journeys/:slug', err);
    res.status(500).json({ success: false, message: 'Could not load journey' });
  }
});

export default router;
