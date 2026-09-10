"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_js_1 = require("./env.js");
const logger_js_1 = require("./logger.js");
let mongodInstance = null;
const connectDatabase = async () => {
    // 1. First attempt: Connect directly to the configured MONGO_URI
    try {
        logger_js_1.logger.info(`Connecting to MongoDB at ${env_js_1.ENV.MONGO_URI}...`);
        const conn = await mongoose_1.default.connect(env_js_1.ENV.MONGO_URI, {
            serverSelectionTimeoutMS: 3000,
        });
        logger_js_1.logger.info(`✅ MongoDB Connected successfully to remote/local host: ${conn.connection.host}`);
        return true;
    }
    catch (error) {
        logger_js_1.logger.warn(`Could not connect to external MongoDB: ${error.message}`);
    }
    // 2. Fallback attempt: Automatically start embedded live MongoDB engine (mongodb-memory-server)
    try {
        logger_js_1.logger.info('Starting embedded real MongoDB engine (mongod binary)...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create({
            instance: {
                dbName: 'saudi_erp',
            },
        });
        const uri = mongodInstance.getUri();
        const conn = await mongoose_1.default.connect(uri);
        logger_js_1.logger.info(`✅ Embedded Real MongoDB Engine running and connected: ${uri}`);
        return true;
    }
    catch (embeddedErr) {
        logger_js_1.logger.error(`Failed to start embedded MongoDB: ${embeddedErr.message}`);
        logger_js_1.logger.info('Please verify MONGO_URI in server/.env or ensure MongoDB is active.');
        return false;
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    await mongoose_1.default.disconnect();
    if (mongodInstance) {
        await mongodInstance.stop();
    }
};
exports.disconnectDatabase = disconnectDatabase;
