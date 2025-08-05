// src/lib/mongo.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI in .env.local');
}

type MongooseGlobal = typeof globalThis & { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } };

const cached =
  ((global as MongooseGlobal).mongoose) ||
  { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;

if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
        dbName: 'ofside-staging',
        bufferCommands: false,
    });
}

  cached.conn = await cached.promise;
  return cached.conn;
}
