import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import HeroSlide from '../models/HeroSlide.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

const FRONTEND_PUBLIC = path.resolve(process.cwd(), '../frontend/public');
const HERO_UPLOAD_DIR = path.join(FRONTEND_PUBLIC, 'hero-slides');

function ensureUploadDir() {
  if (!fs.existsSync(HERO_UPLOAD_DIR)) {
    fs.mkdirSync(HERO_UPLOAD_DIR, { recursive: true });
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, cb) {
      ensureUploadDir();
      cb(null, HERO_UPLOAD_DIR);
    },
    filename(_req, file, cb) {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
      cb(null, `${Date.now()}-${safe}`);
    },
  }),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image uploads are allowed'));
  },
});

function listImagesInDir(dir, urlPrefix) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .map((f) => ({
      url: `${urlPrefix}/${f}`,
      label: f,
    }));
}

router.get('/hero-assets', adminAuth, (_req, res) => {
  const assets = [
    ...listImagesInDir(path.join(FRONTEND_PUBLIC, 'categories/explorer'), '/categories/explorer'),
  ...listImagesInDir(path.join(FRONTEND_PUBLIC, 'categories'), '/categories'),
    ...listImagesInDir(path.join(FRONTEND_PUBLIC, 'krtiv'), '/krtiv'),
    ...listImagesInDir(path.join(FRONTEND_PUBLIC, 'hero-slides'), '/hero-slides'),
    ...listImagesInDir(FRONTEND_PUBLIC, '').filter((a) =>
      /\.(jpe?g|png|webp)$/i.test(a.url)
    ),
  ];
  const seen = new Set();
  const unique = assets.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });
  res.json({ success: true, assets: unique });
});

router.get('/hero-slides', adminAuth, async (req, res) => {
  try {
    const scope = req.query.scope ? String(req.query.scope).trim() : undefined;
    const query = scope ? { scope } : {};
    const slides = await HeroSlide.find(query).sort({ scope: 1, sortOrder: 1, createdAt: 1 });
    res.json({ success: true, slides });
  } catch (err) {
    console.error('Admin list hero slides:', err);
    res.status(500).json({ success: false, message: 'Failed to load slides' });
  }
});

router.post('/hero-slides', adminAuth, async (req, res) => {
  try {
    const { imageUrl, alt, focalX, focalY, kicker, title, description, sortOrder, active, scope } = req.body;
    if (!imageUrl || !title) {
      return res.status(400).json({ success: false, message: 'imageUrl and title are required' });
    }
    const slide = await HeroSlide.create({
      imageUrl,
      alt: alt || '',
      focalX: focalX ?? 50,
      focalY: focalY ?? 50,
      kicker: kicker || '',
      title,
      description: description || '',
      scope: scope || 'home',
      sortOrder: sortOrder ?? 0,
      active: active !== false,
    });
    res.status(201).json({ success: true, slide });
  } catch (err) {
    console.error('Create hero slide:', err);
    res.status(500).json({ success: false, message: 'Failed to create slide' });
  }
});

router.put('/hero-slides/:id', adminAuth, async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Slide not found' });
    }
    res.json({ success: true, slide });
  } catch (err) {
    console.error('Update hero slide:', err);
    res.status(500).json({ success: false, message: 'Failed to update slide' });
  }
});

router.delete('/hero-slides/:id', adminAuth, async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Slide not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Delete hero slide:', err);
    res.status(500).json({ success: false, message: 'Failed to delete slide' });
  }
});

router.post('/hero-slides/upload', adminAuth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    res.json({
      success: true,
      imageUrl: `/hero-slides/${req.file.filename}`,
      label: req.file.filename,
    });
  });
});

export default router;
