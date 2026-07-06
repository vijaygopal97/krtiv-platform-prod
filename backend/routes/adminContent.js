import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import Content, { buildCmsKey } from '../models/Content.js';
import ContentHistory from '../models/ContentHistory.js';
import { contentEditorAuth } from '../middleware/contentEditorAuth.js';

const router = express.Router();

const FRONTEND_PUBLIC = path.resolve(process.cwd(), '../frontend/public');
const CMS_MEDIA_DIR = path.join(FRONTEND_PUBLIC, 'cms-media');

function ensureUploadDir() {
  if (!fs.existsSync(CMS_MEDIA_DIR)) {
    fs.mkdirSync(CMS_MEDIA_DIR, { recursive: true });
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, cb) {
      ensureUploadDir();
      cb(null, CMS_MEDIA_DIR);
    },
    filename(_req, file, cb) {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
      cb(null, `${Date.now()}-${safe}`);
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (/^(image\/|video\/)/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image or video uploads are allowed'));
  },
});

function parseCmsKey(cmsKey) {
  const parts = String(cmsKey).split('.');
  if (parts.length < 3) return null;
  const key = parts.pop();
  const section = parts.pop();
  const page = parts.join('.');
  return { page, section, key };
}

/** Upsert one field (only sends modified fields from client). */
router.patch('/content', contentEditorAuth, async (req, res) => {
  try {
    const { cmsKey, value, valueType, page, section, key } = req.body;
    if (!cmsKey || typeof cmsKey !== 'string') {
      return res.status(400).json({ success: false, message: 'cmsKey is required' });
    }
    const parsed = parseCmsKey(cmsKey) || {
      page: page || 'global',
      section: section || 'main',
      key: key || cmsKey,
    };
    const nextValue = value != null ? String(value) : '';
    const existing = await Content.findOne({ cmsKey });
    const previousValue = existing?.value ?? '';

    if (existing && existing.value === nextValue) {
      return res.json({
        success: true,
        unchanged: true,
        content: existing,
      });
    }

    const doc = await Content.findOneAndUpdate(
      { cmsKey },
      {
        page: parsed.page,
        section: parsed.section,
        key: parsed.key,
        cmsKey,
        value: nextValue,
        valueType: valueType || existing?.valueType || 'text',
        updatedBy: req.userId,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await ContentHistory.create({
      cmsKey,
      page: parsed.page,
      section: parsed.section,
      key: parsed.key,
      previousValue,
      newValue: nextValue,
      editedBy: req.userId,
      editedByEmail: req.adminUser?.email || '',
    });

    res.json({ success: true, content: doc });
  } catch (err) {
    console.error('PATCH /admin/content', err);
    res.status(500).json({ success: false, message: 'Could not save content' });
  }
});

router.get('/content/history', contentEditorAuth, async (req, res) => {
  try {
    const { cmsKey, limit = '30' } = req.query;
    const filter = cmsKey && typeof cmsKey === 'string' ? { cmsKey } : {};
    const rows = await ContentHistory.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 30, 100))
      .populate('editedBy', 'name email')
      .lean();
    res.json({ success: true, history: rows });
  } catch (err) {
    console.error('GET /admin/content/history', err);
    res.status(500).json({ success: false, message: 'Could not load history' });
  }
});

router.post('/content/rollback', contentEditorAuth, async (req, res) => {
  try {
    const { historyId } = req.body;
    if (!historyId) {
      return res.status(400).json({ success: false, message: 'historyId is required' });
    }
    const entry = await ContentHistory.findById(historyId);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'History entry not found' });
    }
    const rollbackValue = entry.previousValue;
    const existing = await Content.findOne({ cmsKey: entry.cmsKey });
    const previousValue = existing?.value ?? entry.newValue;

    const doc = await Content.findOneAndUpdate(
      { cmsKey: entry.cmsKey },
      {
        page: entry.page,
        section: entry.section,
        key: entry.key,
        cmsKey: entry.cmsKey,
        value: rollbackValue,
        updatedBy: req.userId,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await ContentHistory.create({
      cmsKey: entry.cmsKey,
      page: entry.page,
      section: entry.section,
      key: entry.key,
      previousValue,
      newValue: rollbackValue,
      editedBy: req.userId,
      editedByEmail: req.adminUser?.email || '',
    });

    res.json({ success: true, content: doc });
  } catch (err) {
    console.error('POST /admin/content/rollback', err);
    res.status(500).json({ success: false, message: 'Could not rollback' });
  }
});

router.post('/content/upload', contentEditorAuth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const basePath = process.env.CMS_PUBLIC_BASE || '/cms-media';
    const url = `${basePath}/${req.file.filename}`;
    res.json({ success: true, url, filename: req.file.filename });
  });
});

export default router;
