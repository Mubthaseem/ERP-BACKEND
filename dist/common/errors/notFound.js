"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const ApiError_js_1 = require("./ApiError.js");
const notFound = (req, res, next) => {
    next(ApiError_js_1.ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};
exports.notFound = notFound;
