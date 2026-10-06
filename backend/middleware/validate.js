import Joi from 'joi';
export const validate = schema => (req, res, next) => { const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true }); if (error) return res.status(400).json({ message: error.details.map(d => d.message).join(', ') }); req.body = value; next(); };
export const authSchema = Joi.object({ name: Joi.string().trim().min(2).max(100), email: Joi.string().email().required(), password: Joi.string().min(8).max(72).required(), role: Joi.string().valid('Patient', 'Doctor', 'Admin') });
export const appointmentSchema = Joi.object({ doctor: Joi.string().required(), doctorName: Joi.string().required(), date: Joi.date().required(), time: Joi.string().required(), reason: Joi.string().min(3).max(500).required(), symptoms: Joi.string().min(3).max(1000).allow('') });
export const forgotPasswordSchema = Joi.object({ email: Joi.string().email().required() });
export const resetPasswordSchema = Joi.object({ password: Joi.string().min(8).max(72).required() });
export const verifyOtpSchema = Joi.object({ email: Joi.string().email().required(), otp: Joi.string().pattern(/^\d{6}$/).required() });
