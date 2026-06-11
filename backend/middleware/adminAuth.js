import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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

export async function adminAuth(req, res, next) {
  const token = extractJwt(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('role email name');
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.userId = String(user._id);
    req.userRole = user.role;
    req.adminUser = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
