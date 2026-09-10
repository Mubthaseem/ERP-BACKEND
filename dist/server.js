"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const env_js_1 = require("./config/env.js");
const database_js_1 = require("./config/database.js");
const seed_js_1 = require("./config/seed.js");
const logger_js_1 = require("./config/logger.js");
const startServer = async () => {
    try {
        // 1. Initialize Real MongoDB Engine & Connection
        const isConnected = await (0, database_js_1.connectDatabase)();
        // 2. Seed Real Master Data if database is fresh
        if (isConnected) {
            await (0, seed_js_1.seedDatabaseIfEmpty)();
        }
        // 3. Start Express HTTP Server
        const server = app_js_1.default.listen(env_js_1.ENV.PORT, () => {
            logger_js_1.logger.info(`=======================================================`);
            logger_js_1.logger.info(`🚀 SAUDI ARABIA & DUBAI ERP SYSTEM API RUNNING`);
            logger_js_1.logger.info(`🌐 Gateway URL: http://localhost:${env_js_1.ENV.PORT}`);
            logger_js_1.logger.info(`📊 Database: Real MongoDB (Live Persistent State)`);
            logger_js_1.logger.info(`🇸🇦 Currency: ${env_js_1.ENV.DEFAULT_CURRENCY} | Standard VAT: ${env_js_1.ENV.DEFAULT_VAT_RATE}%`);
            logger_js_1.logger.info(`⚡ ZATCA Phase 1 & 2 E-Invoicing: ACTIVE`);
            logger_js_1.logger.info(`=======================================================`);
        });
        const handleShutdown = (signal) => {
            logger_js_1.logger.info(`Received ${signal}. Shutting down gracefully...`);
            server.close(() => {
                logger_js_1.logger.info('Server closed.');
                process.exit(0);
            });
        };
        process.on('SIGTERM', () => handleShutdown('SIGTERM'));
        process.on('SIGINT', () => handleShutdown('SIGINT'));
    }
    catch (error) {
        logger_js_1.logger.error(`Fatal Server Startup Error: ${error.message}`);
        process.exit(1);
    }
};
startServer();
