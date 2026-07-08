/**
 * Proxy routes for SignPost (eflag.in) API. All eflag.in requests and the API key
 * stay on the backend; the frontend only calls these routes.
 */
import express from 'express';

const router = express.Router();

const SIGNPOST_BASE = (process.env.SIGNPOST_BASE_URL || 'https://eflag.in').replace(/\/$/, '');
const SIGNPOST_API_KEY = process.env.SIGNPOST_API_KEY || 'c1b28a78c58efa1c3a0966f2063f240ebbdc60d50d76c7d802723e1e325f2387';

async function proxyToSignPost(path, res, options = {}) {
  try {
    const url = `${SIGNPOST_BASE}${path}`;
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'X-API-Key': SIGNPOST_API_KEY,
        'Content-Type': 'application/json',
      },
      body: options.body,
    });
    if (response.status === 404) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('SignPost proxy error', response.status, path, text);
      return res.status(response.status).json({ error: text || 'Upstream error' });
    }
    const data = await response.json().catch(() => null);
    if (data == null) return res.status(502).json({ error: 'Invalid response' });
    return res.json(data);
  } catch (err) {
    console.error('SignPost proxy fetch error', path, err);
    return res.status(502).json({ error: 'Service unavailable' });
  }
}

/** GET /api/signpost/best-video?category=...&language=en */
router.get('/best-video', (req, res) => {
  const category = req.query.category;
  const language = (req.query.language || 'en').toString();
  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid category' });
  }
  const params = new URLSearchParams({ category: category.trim(), language });
  return proxyToSignPost(`/api/v1/best-video?${params}`, res);
});

/** GET /api/signpost/best-itinerary?category=... */
router.get('/best-itinerary', (req, res) => {
  const category = req.query.category;
  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid category' });
  }
  const params = new URLSearchParams({ category: category.trim() });
  return proxyToSignPost(`/api/v1/best-itinerary?${params}`, res);
});

/** POST /api/signpost/itinerary-jobs — start itinerary-only generation (uses 1 credit) */
router.post('/itinerary-jobs', (req, res) => {
  const body = req.body || {};
  const payload = {
    title: typeof body.title === 'string' ? body.title : 'API Itinerary',
    userProfile: {
      age: String(body.userProfile?.age ?? '28'),
      interestCategory: Array.isArray(body.userProfile?.interestCategory)
        ? body.userProfile.interestCategory.map((x) => String(x))
        : ['Culinary', 'Rural'],
      travelWith: String(body.userProfile?.travelWith ?? 'Family'),
      originCity: String(body.userProfile?.originCity ?? 'Mumbai'),
      durationDays: String(body.userProfile?.durationDays ?? '3'),
      preferredLocations: Array.isArray(body.userProfile?.preferredLocations)
        ? body.userProfile.preferredLocations.map((x) => String(x).trim()).filter(Boolean)
        : [],
      tourismKeywords: Array.isArray(body.userProfile?.tourismKeywords)
        ? body.userProfile.tourismKeywords.map((x) => String(x).trim()).filter(Boolean)
        : [],
      categoryFocus: String(body.userProfile?.categoryFocus ?? '').trim(),
      travelSeason: String(body.userProfile?.travelSeason ?? '').trim(),
    },
  };
  return proxyToSignPost('/api/v1/itinerary-jobs', res, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
});

/** GET /api/signpost/jobs/:jobId — poll video or itinerary job status/result */
router.get('/jobs/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  if (!jobId || !/^[a-f0-9]+$/i.test(jobId)) {
    return res.status(400).json({ error: 'Invalid job ID' });
  }
  return proxyToSignPost(`/api/v1/jobs/${jobId}`, res);
});

/** POST /api/signpost/videos/:threadId/engagement — category video analytics (proxied to SignPost) */
router.post('/videos/:threadId/engagement', (req, res) => {
  const threadId = req.params.threadId;
  if (!threadId || !/^[a-f0-9]{24}$/i.test(threadId)) {
    return res.status(400).json({ error: 'Invalid thread ID' });
  }
  return proxyToSignPost(`/api/v1/videos/${encodeURIComponent(threadId)}/engagement`, res, {
    method: 'POST',
    body: JSON.stringify(req.body && typeof req.body === 'object' ? req.body : {}),
  });
});

export default router;
