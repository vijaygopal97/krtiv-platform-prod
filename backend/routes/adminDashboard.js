import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { getAdminDashboardOverview } from '../services/adminDashboardStats.js';
import { isGa4Configured } from '../services/ga4Reports.js';

const router = express.Router();

/** GET /admin/dashboard-overview?range=30d */
router.get('/dashboard-overview', adminAuth, async (req, res) => {
  try {
    const overview = await getAdminDashboardOverview({ range: req.query.range || '30d' });
    res.json({ success: true, overview });
  } catch (err) {
    console.error('GET /admin/dashboard-overview', err);
    res.status(500).json({ success: false, message: 'Could not load dashboard' });
  }
});

/** GET /admin/ga4-status */
router.get('/ga4-status', adminAuth, async (_req, res) => {
  res.json({
    success: true,
    configured: isGa4Configured(),
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.GA4_MEASUREMENT_ID || 'G-D1XM5S3NFY',
  });
});

export default router;
