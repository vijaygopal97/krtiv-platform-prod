import express from 'express';
import FeaturedCategory from '../models/FeaturedCategory.js';
import ExperienceBlog from '../models/ExperienceBlog.js';
import { contentEditorAuth } from '../middleware/contentEditorAuth.js';

const router = express.Router();

router.get('/featured-categories', contentEditorAuth, async (_req, res) => {
  try {
    const categories = await FeaturedCategory.find().sort({ sortOrder: 1 }).lean();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not load categories' });
  }
});

router.post('/featured-categories', contentEditorAuth, async (req, res) => {
  try {
    const doc = await FeaturedCategory.create(req.body);
    res.json({ success: true, category: doc });
  } catch (err) {
    console.error('POST featured-categories', err);
    res.status(400).json({ success: false, message: err.message || 'Create failed' });
  }
});

router.patch('/featured-categories/:slug', contentEditorAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    const updates = { ...req.body };
    delete updates.slug;
    delete updates._id;
    const doc = await FeaturedCategory.findOneAndUpdate({ slug }, { $set: updates }, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

router.delete('/featured-categories/:slug', contentEditorAuth, async (req, res) => {
  try {
    await FeaturedCategory.deleteOne({ slug: req.params.slug });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

router.get('/experience-blogs', contentEditorAuth, async (_req, res) => {
  try {
    const blogs = await ExperienceBlog.find().sort({ sortOrder: 1, title: 1 }).lean();
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not load blogs' });
  }
});

router.post('/experience-blogs', contentEditorAuth, async (req, res) => {
  try {
    const doc = await ExperienceBlog.create(req.body);
    res.json({ success: true, blog: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Create failed' });
  }
});

router.patch('/experience-blogs/:slug', contentEditorAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    const updates = { ...req.body };
    delete updates.slug;
    delete updates._id;
    const doc = await ExperienceBlog.findOneAndUpdate({ slug }, { $set: updates }, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, blog: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

router.delete('/experience-blogs/:slug', contentEditorAuth, async (req, res) => {
  try {
    await ExperienceBlog.deleteOne({ slug: req.params.slug });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

export default router;
