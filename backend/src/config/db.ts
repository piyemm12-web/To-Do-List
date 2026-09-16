import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to provided MongoDB URI...');
      await mongoose.connect(mongoUri);
      console.log('MongoDB Connected successfully to external database.');
    } else {
      console.log('No MONGODB_URI found. Initializing in-memory MongoDB database...');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      console.log(`In-memory MongoDB server started & connected at: ${uri}`);
    }
  } catch (error) {
    console.error('MongoDB connection error, attempting fallback to memory server...', error);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      console.log(`Fallback In-Memory MongoDB connected successfully at ${uri}`);
    } catch (fallbackErr) {
      console.error('Fatal: Could not connect to any MongoDB server.', fallbackErr);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
