import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import VideoReaction from '../models/VideoReaction.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kraik-dev-secret-change-in-production';

function normPath(p) {
  if (p == null || typeof p !== 'string') return '';
  return p.replace(/\\/g, '/').replace(/^\/+/g, '').trim();
}

function validThreadId(id) {
  return typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id.trim());
}

/** JWT from headers (when proxy forwards them) or JSON body (when Authorization is stripped). */
function extractJwt(req) {
  const h = req.headers.authorization;
  if (h && typeof h === 'string' && h.toLowerCase().startsWith('bearer ')) {
    return h.slice(7).trim();
  }
  const x = req.headers['x-access-token'] || req.headers['x-auth-token'];
  if (x && typeof x === 'string') {
    const t = x.trim();
    if (t.toLowerCase().startsWith('bearer ')) return t.slice(7).trim();
    return t;
  }
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  if (typeof b.authToken === 'string' && b.authToken.trim()) return b.authToken.trim();
  return '';
}

function userIdFromRequest(req, res) {
  const token = extractJwt(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const id = payload?.id;
    if (!id) {
      res.status(401).json({ error: 'Invalid token' });
      return null;
    }
    return String(id);
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
}

/**
 * POST /api/me/video-reaction
 * Body: { op: 'get'|'set', threadId, videoPath, reaction?, authToken? }
 * authToken required when reverse proxy strips Authorization (send same JWT as login).
 */
router.post('/video-reaction', async (req, res) => {
  try {
    const userId = userIdFromRequest(req, res);
    if (!userId) return;

    const op = req.body?.op;
    const threadId = req.body?.threadId != null ? String(req.body.threadId).trim() : '';
    const videoPath = normPath(req.body?.videoPath);
    if (!validThreadId(threadId) || !videoPath) {
      return res.status(400).json({ error: 'threadId and videoPath are required' });
    }
    const uid = new mongoose.Types.ObjectId(userId);

    if (op === 'get') {
      const doc = await VideoReaction.findOne({ userId: uid, threadId, videoPath }).lean();
      return res.json({ reaction: doc?.reaction || null });
    }

    if (op === 'set') {
      const reaction = req.body?.reaction;
      if (reaction == null || reaction === '') {
        await VideoReaction.deleteOne({ userId: uid, threadId, videoPath });
        return res.json({ ok: true, reaction: null });
      }
      if (reaction !== 'like' && reaction !== 'dislike') {
        return res.status(400).json({ error: 'reaction must be like, dislike, or null' });
      }
      await VideoReaction.findOneAndUpdate(
        { userId: uid, threadId, videoPath },
        { $set: { reaction, updatedAt: new Date() } },
        { upsert: true, new: true }
      );
      return res.json({ ok: true, reaction });
    }

    return res.status(400).json({ error: 'op must be get or set' });
  } catch (err) {
    console.error('POST /me/video-reaction', err);
    return res.status(500).json({ error: err.message || 'Failed' });
  }
});

export default router;
