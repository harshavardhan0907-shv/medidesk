import mongoose from 'mongoose';
const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true, trim: true },
  doctorName: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  time: { type: String, required: true, trim: true },
  reason: { type: String, required: true, trim: true, maxlength: 500 },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'], default: 'Pending' },
  qrNonceHash: { type: String, select: false },
  qrExpiresAt: { type: Date },
  checkedInAt: { type: Date },
  checkInBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
appointmentSchema.index({ doctor: 1, date: 1, time: 1 });
export default mongoose.model('Appointment', appointmentSchema);
