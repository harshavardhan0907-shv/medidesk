import User from '../models/User.js';
export async function update(req, res, next) { try { const allowed = (({ name, phone, specialty }) => ({ name, phone, specialty }))(req.body); const user = await User.findByIdAndUpdate(req.user._id, allowed, { new: true, runValidators: true }).select('-password'); res.json(user); } catch (e) { next(e); } }
