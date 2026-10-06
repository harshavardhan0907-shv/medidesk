import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['Patient', 'Doctor', 'Admin'], default: 'Patient' },
  phone: String,
  specialty: String,
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: Date,
  lastLoginAt: Date,
  passwordResetTokenHash: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  passwordResetOtpHash: { type: String, select: false },
  passwordResetOtpExpires: { type: Date, select: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('User', userSchema);
