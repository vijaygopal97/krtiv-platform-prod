import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { getPlannerAdminStats } from '../services/plannerAnalytics.js';

const router = express.Router();

router.get('/planner-stats', adminAuth, async (_req, res) => {
  try {
    const stats = await getPlannerAdminStats();
    res.json({ success: true, stats });
  } catch (err) {
    console.error('GET /admin/planner-stats', err);
    res.status(500).json({ success: false, message: 'Failed to load stats' });
  }
});

export default router;
