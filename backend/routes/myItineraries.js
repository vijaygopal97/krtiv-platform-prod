import express from 'express';
import { authJwt } from '../middleware/authJwt.js';
import SavedItinerary from '../models/SavedItinerary.js';

const router = express.Router();

router.get('/', authJwt, async (req, res) => {
  try {
    const favoritesOnly = req.query.favorites === '1' || req.query.favorites === 'true';
    const filter = { userId: req.userId };
    if (favoritesOnly) filter.isFavorite = true;
    const items = await SavedItinerary.find(filter).sort({ updatedAt: -1 }).limit(100).lean();
    res.json({ success: true, items });
  } catch (err) {
    console.error('GET /my/itineraries', err);
    res.status(500).json({ success: false, message: 'Failed to load itineraries' });
  }
});

router.post('/', authJwt, async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const title = (body.title && String(body.title).trim()) || 'My Maharashtra Itinerary';
    const itineraryText = body.itineraryText && String(body.itineraryText);
    if (!itineraryText || !itineraryText.trim()) {
      return res.status(400).json({ success: false, message: 'itineraryText is required' });
    }
    const doc = await SavedItinerary.create({
      userId: req.userId,
      title,
      categoryFocus: (body.categoryFocus && String(body.categoryFocus)) || '',
      categorySlug: (body.categorySlug && String(body.categorySlug)) || '',
      keywords: Array.isArray(body.keywords) ? body.keywords.map((k) => String(k).trim()).filter(Boolean) : [],
      itineraryText: itineraryText.trim(),
      parsedSummary: body.parsedSummary && typeof body.parsedSummary === 'object' ? body.parsedSummary : {},
      source: body.source === 'dashboard' ? 'dashboard' : 'smart-keywords',
      isFavorite: Boolean(body.isFavorite),
      jobId: (body.jobId && String(body.jobId)) || '',
    });
    res.status(201).json({ success: true, item: doc });
  } catch (err) {
    console.error('POST /my/itineraries', err);
    res.status(500).json({ success: false, message: 'Failed to save itinerary' });
  }
});

router.patch('/:id', authJwt, async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const update = {};
    if (typeof body.isFavorite === 'boolean') update.isFavorite = body.isFavorite;
    if (body.title && String(body.title).trim()) update.title = String(body.title).trim();
    const doc = await SavedItinerary.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: update },
      { new: true }
    ).lean();
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, item: doc });
  } catch (err) {
    console.error('PATCH /my/itineraries/:id', err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

router.delete('/:id', authJwt, async (req, res) => {
  try {
    const result = await SavedItinerary.deleteOne({ _id: req.params.id, userId: req.userId });
    if (!result.deletedCount) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /my/itineraries/:id', err);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

export default router;
