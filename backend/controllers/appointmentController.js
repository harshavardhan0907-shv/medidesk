import Appointment from '../models/Appointment.js';
import { recordAudit } from './auditController.js';
import { createCheckInToken, hashNonce, verifyCheckInToken } from '../config/qr.js';
export async function list(req, res, next) { try { const filter = req.user.role === 'Patient' ? { patient: req.user._id } : req.user.role === 'Doctor' ? { doctor: req.user._id } : {}; res.json(await Appointment.find(filter).sort({ date: 1 }).populate('patient doctor', 'name email specialty')); } catch (e) { next(e); } }
export async function create(req, res, next) { try { const item = await Appointment.create({ ...req.body, patient: req.user._id, patientName: req.user.name }); await recordAudit({ actor: req.user._id, action: 'APPOINTMENT_CREATED', resource: 'Appointment', resourceId: item._id.toString(), req }); res.status(201).json(item); } catch (e) { next(e); } }
export async function updateStatus(req, res, next) { try { const allowed = req.user.role === 'Admin' || req.user.role === 'Doctor'; if (!allowed) return res.status(403).json({ message: 'Only doctors or admins can change status' }); const item = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }); if (!item) return res.status(404).json({ message: 'Appointment not found' }); await recordAudit({ actor: req.user._id, action: `APPOINTMENT_${req.body.status.toUpperCase()}`, resource: 'Appointment', resourceId: item._id.toString(), req }); res.json(item); } catch (e) { next(e); } }
export async function cancel(req, res, next) { try { const item = await Appointment.findOneAndUpdate({ _id: req.params.id, patient: req.user._id }, { status: 'Cancelled' }, { new: true }); if (!item) return res.status(404).json({ message: 'Appointment not found' }); res.json(item); } catch (e) { next(e); } }
export async function issueQr(req, res, next) {
  try {
    const item = await Appointment.findOne({ _id: req.params.id, patient: req.user._id }).select('+qrNonceHash');
    if (!item) return res.status(404).json({ message: 'Appointment not found' });
    if (['Cancelled', 'Rejected', 'Completed'].includes(item.status)) return res.status(409).json({ message: 'This appointment cannot receive a check-in pass' });
    const qr = createCheckInToken(item._id.toString());
    item.qrNonceHash = hashNonce(qr.nonce);
    item.qrExpiresAt = new Date(qr.expiresAt);
    item.checkedInAt = undefined;
    item.checkInBy = undefined;
    await item.save();
    await recordAudit({ actor: req.user._id, action: 'CHECK_IN_QR_ISSUED', resource: 'Appointment', resourceId: item._id.toString(), req });
    res.json({ token: qr.token, expiresAt: qr.expiresAt, appointmentId: item._id });
  } catch (e) { next(e); }
}
export async function checkIn(req, res, next) {
  try {
    const parsed = verifyCheckInToken(req.body.token);
    if (!parsed) return res.status(400).json({ message: 'QR pass is invalid or expired' });
    const item = await Appointment.findById(parsed.appointmentId).select('+qrNonceHash');
    if (!item || item.qrNonceHash !== hashNonce(parsed.nonce) || !item.qrExpiresAt || item.qrExpiresAt.getTime() < Date.now()) return res.status(400).json({ message: 'QR pass is invalid, expired, or already used' });
    if (item.doctor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') return res.status(403).json({ message: 'Only the assigned doctor or an admin can check in this patient' });
    if (!['Pending', 'Approved'].includes(item.status)) return res.status(409).json({ message: `Appointment is ${item.status.toLowerCase()} and cannot be checked in` });
    item.status = 'Completed';
    item.checkedInAt = new Date();
    item.checkInBy = req.user._id;
    item.qrNonceHash = undefined;
    await item.save();
    await recordAudit({ actor: req.user._id, action: 'PATIENT_CHECKED_IN', resource: 'Appointment', resourceId: item._id.toString(), req });
    res.json({ message: 'Patient checked in successfully', appointment: item });
  } catch (e) { next(e); }
}
