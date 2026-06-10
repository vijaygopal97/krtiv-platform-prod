import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kraik-dev-secret-change-in-production';

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
  return '';
}

/**
 * Same JWT as /api/auth/login.
 * Accepts `Authorization: Bearer <token>` or `X-Access-Token` / `X-Auth-Token` (some proxies strip Authorization).
 */
export function authJwt(req, res, next) {
  const token = extractJwt(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const id = payload.id;
    if (!id) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = String(id);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
