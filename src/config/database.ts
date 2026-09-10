import mongoose from 'mongoose';
import { ENV } from './env.js';
import { logger } from './logger.js';

let mongodInstance: any = null;

export const connectDatabase = async (): Promise<boolean> => {
  // 1. First attempt: Connect directly to the configured MONGO_URI
  try {
    logger.info(`Connecting to MongoDB at ${ENV.MONGO_URI}...`);
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    logger.info(`✅ MongoDB Connected successfully to remote/local host: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    logger.warn(`Could not connect to external MongoDB: ${error.message}`);
  }

  // 2. Fallback attempt: Automatically start embedded live MongoDB engine (mongodb-memory-server)
  try {
    logger.info('Starting embedded real MongoDB engine (mongod binary)...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'saudi_erp',
      },
    });
    const uri = mongodInstance.getUri();
    const conn = await mongoose.connect(uri);
    logger.info(`✅ Embedded Real MongoDB Engine running and connected: ${uri}`);
    return true;
  } catch (embeddedErr: any) {
    logger.error(`Failed to start embedded MongoDB: ${embeddedErr.message}`);
    logger.info('Please verify MONGO_URI in server/.env or ensure MongoDB is active.');
    return false;
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
