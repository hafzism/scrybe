import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI as string;


// Check if connection string exists
if (!MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// This prevents creating multiple connections
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If already connected, return existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // If not connected, create new connection
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
