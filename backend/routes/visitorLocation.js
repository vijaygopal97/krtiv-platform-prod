import { Router } from 'express';

const router = Router();

function isPrivateOrLocalIp(ip) {
  if (!ip || ip === '::1' || ip === '127.0.0.1') return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('169.254.')) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  return false;
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const first = String(forwarded).split(',')[0]?.trim();
    if (first) return first;
  }
  const real = req.headers['x-real-ip'];
  if (real) return String(real).trim();
  const cf = req.headers['cf-connecting-ip'];
  if (cf) return String(cf).trim();
  return req.socket?.remoteAddress || null;
}

/** GET /api/visitor-location — resolve visitor city from IP for itinerary origin. */
router.get('/', async (req, res) => {
  const ip = clientIp(req);
  const query =
    ip && !isPrivateOrLocalIp(ip)
      ? `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,regionName,country`
      : 'http://ip-api.com/json/?fields=status,city,regionName,country';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const geoRes = await fetch(query, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!geoRes.ok) throw new Error('geo lookup failed');
    const data = await geoRes.json();
    if (data.status === 'success' && data.city?.trim()) {
      return res.json({
        city: data.city.trim(),
        region: data.regionName?.trim() || '',
        country: data.country?.trim() || '',
        source: 'ip',
      });
    }
  } catch {
    /* fall through */
  }

  return res.json({ city: 'Mumbai', region: '', country: 'India', source: 'default' });
});

export default router;
