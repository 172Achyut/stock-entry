import mongoose from 'mongoose';

let cached = global._mongoConn;

export async function connectDB() {
  if (cached && mongoose.connection.readyState === 1) return;

  cached = mongoose.connect(process.env.MONGODB_URI);
  global._mongoConn = cached;
  await cached;
}
