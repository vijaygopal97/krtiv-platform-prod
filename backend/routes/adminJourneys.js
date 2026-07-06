import express from 'express';
import Journey from '../models/Journey.js';
import { contentEditorAuth } from '../middleware/contentEditorAuth.js';

const router = express.Router();

router.get('/journeys', contentEditorAuth, async (_req, res) => {
  try {
    const journeys = await Journey.find().sort({ sortOrder: 1 }).lean();
    res.json({ success: true, journeys });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not load journeys' });
  }
});

router.patch('/journeys/:slug', contentEditorAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid body' });
    }
    delete updates.slug;
    delete updates._id;
    const doc = await Journey.findOneAndUpdate({ slug }, { $set: updates }, { new: true });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Journey not found' });
    }
    res.json({ success: true, journey: doc });
  } catch (err) {
    console.error('PATCH /admin/journeys/:slug', err);
    res.status(500).json({ success: false, message: 'Could not update journey' });
  }
});

export default router;
