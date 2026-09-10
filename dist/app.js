"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const errorHandler_js_1 = require("./common/errors/errorHandler.js");
const notFound_js_1 = require("./common/errors/notFound.js");
const app = (0, express_1.default)();
// Global Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// Static uploads serving
app.use('/uploads', express_1.default.static('uploads'));
// Base Route
app.get('/', (req, res) => {
    res.json({
        name: 'Saudi Arabia ERP API Gateway',
        version: '1.0.0',
        description: 'Enterprise ERP System Backend with MongoDB, Express & TypeScript',
        market: 'KSA (Saudi Arabia)',
        currency: 'SAR',
        vatRate: '15%',
        docs: '/api/health',
    });
});
// API Routes
app.use('/api', index_js_1.default);
// 404 & Global Error Handling
app.use(notFound_js_1.notFound);
app.use(errorHandler_js_1.errorHandler);
exports.default = app;
