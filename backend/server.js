import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import profileRoutes from './routes/profile.js';
import adminRoutes from './routes/admin.js';

const app = express();
const port = process.env.PORT || 4000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) throw new Error('JWT_SECRET must be configured in production');
const allowedOrigins = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean) : ['http://localhost:3000'];
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false, frameguard: false }));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
const stripMongoOperators = value => Array.isArray(value) ? value.map(stripMongoOperators) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).filter(([key]) => !key.startsWith('$') && !key.includes('.')).map(([key, entry]) => [key, stripMongoOperators(entry)])) : value;
const escapeMarkup = value => Array.isArray(value) ? value.map(escapeMarkup) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, escapeMarkup(entry)])) : typeof value === 'string' ? value.replace(/[<>]/g, character => character === '<' ? '&lt;' : '&gt;') : value;
app.use((req, _res, next) => { req.body = escapeMarkup(stripMongoOperators(req.body)); next(); });
app.use(morgan('tiny'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 250, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'medidesk-api', time: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/error', (_req, res) => res.status(404).json({ message: 'Not found' }));

const dist = path.resolve(__dirname, '../dist');
app.use(express.static(dist));
app.get('/{*splat}', (req, res, next) => req.path.startsWith('/api') ? next() : res.sendFile(path.join(dist, 'index.html'), err => err && res.status(404).json({ message: 'Client build not found' })));
app.use((err, _req, res, _next) => { console.error(err); res.status(err.status || 500).json({ message: err.message || 'Server error' }); });

if (process.env.MONGODB_URI) mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected')).catch(err => console.error('MongoDB connection failed:', err.message));
app.listen(port, '0.0.0.0', () => console.log(`MediDesk API listening on ${port}`));
export default app;
