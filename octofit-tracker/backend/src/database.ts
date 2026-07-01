import mongoose from 'mongoose';

export const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';

export async function connectToDatabase() {
  await mongoose.connect(mongoUri);
  return mongoose.connection;
}
