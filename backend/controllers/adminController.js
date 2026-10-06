import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import AuditLog from '../models/AuditLog.js';
import { getLoginEvents } from '../config/loginActivity.js';
export async function users(_req, res, next) { try { const [items, appointments, audits] = await Promise.all([User.find().select('-password').sort({ createdAt: -1 }), Appointment.countDocuments(), AuditLog.countDocuments()]); res.json({ users: items, analytics: { totalUsers: items.length, appointments, auditEvents: audits, doctors: items.filter(item => item.role === 'Doctor').length, patients: items.filter(item => item.role === 'Patient').length } }); } catch (e) { next(e); } }
export async function loginActivity(_req, res) { res.json({ events: getLoginEvents() }); }
