import express from 'express';
import { authJwt } from '../middleware/authJwt.js';
import SavedPlace from '../models/SavedPlace.js';

const router = express.Router();

function normalizePlace(body) {
  if (!body || typeof body !== 'object') return null;
  const slug = body.slug && String(body.slug).trim();
  if (!slug) return null;
  const place = {
    slug,
    title: (body.title && String(body.title).trim()) || '',
    image: (body.image && String(body.image).trim()) || '',
    locationLabel: (body.locationLabel && String(body.locationLabel).trim()) || '',
    source: (body.source && String(body.source).trim()) || '',
  };
  if (typeof body.lat === 'number' && Number.isFinite(body.lat)) place.lat = body.lat;
  if (typeof body.lng === 'number' && Number.isFinite(body.lng)) place.lng = body.lng;
  return place;
}

router.get('/', authJwt, async (req, res) => {
  try {
    const items = await SavedPlace.find({ userId: req.userId }).sort({ updatedAt: -1 }).limit(200).lean();
    res.json({ success: true, items });
  } catch (err) {
    console.error('GET /my/places', err);
    res.status(500).json({ success: false, message: 'Failed to load saved places' });
  }
});

router.post('/', authJwt, async (req, res) => {
  try {
    const place = normalizePlace(req.body);
    if (!place) return res.status(400).json({ success: false, message: 'slug is required' });
    const doc = await SavedPlace.findOneAndUpdate(
      { userId: req.userId, slug: place.slug },
      { $set: place },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    res.status(201).json({ success: true, item: doc });
  } catch (err) {
    console.error('POST /my/places', err);
    res.status(500).json({ success: false, message: 'Failed to save place' });
  }
});

router.post('/sync', authJwt, async (req, res) => {
  try {
    const raw = req.body?.places;
    if (!Array.isArray(raw)) {
      return res.status(400).json({ success: false, message: 'places array is required' });
    }
    const ops = [];
    for (const entry of raw) {
      const place = normalizePlace(entry);
      if (!place) continue;
      ops.push(
        SavedPlace.findOneAndUpdate(
          { userId: req.userId, slug: place.slug },
          { $set: place },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      );
    }
    if (ops.length) await Promise.all(ops);
    const items = await SavedPlace.find({ userId: req.userId }).sort({ updatedAt: -1 }).limit(200).lean();
    res.json({ success: true, items });
  } catch (err) {
    console.error('POST /my/places/sync', err);
    res.status(500).json({ success: false, message: 'Failed to sync saved places' });
  }
});

router.delete('/:slug', authJwt, async (req, res) => {
  try {
    const slug = decodeURIComponent(req.params.slug || '').trim();
    if (!slug) return res.status(400).json({ success: false, message: 'slug is required' });
    const result = await SavedPlace.deleteOne({ userId: req.userId, slug });
    if (!result.deletedCount) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /my/places/:slug', err);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

export default router;
