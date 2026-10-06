import crypto from 'crypto';

const secret = () => process.env.QR_SECRET || process.env.JWT_SECRET || 'development-only-qr-secret';
const signPayload = payload => crypto.createHmac('sha256', secret()).update(payload).digest('base64url');

export function createCheckInToken(appointmentId, expiresAt = Date.now() + 24 * 60 * 60 * 1000) {
  const nonce = crypto.randomBytes(24).toString('base64url');
  const payload = `mdqr.v1.${appointmentId}.${expiresAt}.${nonce}`;
  return { token: `${payload}.${signPayload(payload)}`, nonce, expiresAt };
}

export function verifyCheckInToken(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 6 || parts[0] !== 'mdqr' || parts[1] !== 'v1') return null;
  const [, , appointmentId, expiresText, nonce, signature] = parts;
  const payload = parts.slice(0, 5).join('.');
  const expiresAt = Number(expiresText);
  if (!appointmentId || !nonce || !Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return null;
  const expected = signPayload(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return { appointmentId, nonce, expiresAt };
}

export function hashNonce(nonce) {
  return crypto.createHash('sha256').update(nonce).digest('hex');
}
