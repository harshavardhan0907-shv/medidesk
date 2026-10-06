import mongoose from 'mongoose';
export async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) return { connected: false, reason: 'MONGODB_URI is not configured' };
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  return { connected: true };
}
