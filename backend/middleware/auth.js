import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { findDemoUserById } from '../config/demoUsers.js';
export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development-only-secret');
    if (payload.demo) {
      const demoUser = findDemoUserById(payload.id);
      if (!demoUser) return res.status(401).json({ message: 'Session expired' });
      req.user = demoUser;
      return next();
    }
    const user = await User.findById(payload.id).select('-password');
    if (!user || !user.isActive) return res.status(401).json({ message: 'Session expired' });
    req.user = user;
    next();
  } catch { res.status(401).json({ message: 'Invalid or expired session' }); }
}
export const allow = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Insufficient permissions' });
