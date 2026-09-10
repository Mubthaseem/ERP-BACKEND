"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/saudi_erp',
    JWT_SECRET: process.env.JWT_SECRET || 'saudi_erp_super_secure_jwt_secret_key_2026',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY || 'SAR',
    DEFAULT_VAT_RATE: Number(process.env.DEFAULT_VAT_RATE) || 15,
};
