import app from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { seedDatabaseIfEmpty } from './config/seed.js';
import { logger } from './config/logger.js';

const startServer = async () => {
  try {
    // 1. Initialize Real MongoDB Engine & Connection
    const isConnected = await connectDatabase();

    // 2. Seed Real Master Data if database is fresh
    if (isConnected) {
      await seedDatabaseIfEmpty();
    }

    // 3. Start Express HTTP Server
    const server = app.listen(ENV.PORT, () => {
      logger.info(`=======================================================`);
      logger.info(`🚀 SAUDI ARABIA & DUBAI ERP SYSTEM API RUNNING`);
      logger.info(`🌐 Gateway URL: http://localhost:${ENV.PORT}`);
      logger.info(`📊 Database: Real MongoDB (Live Persistent State)`);
      logger.info(`🇸🇦 Currency: ${ENV.DEFAULT_CURRENCY} | Standard VAT: ${ENV.DEFAULT_VAT_RATE}%`);
      logger.info(`⚡ ZATCA Phase 1 & 2 E-Invoicing: ACTIVE`);
      logger.info(`=======================================================`);
    });

    const handleShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error: any) {
    logger.error(`Fatal Server Startup Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
