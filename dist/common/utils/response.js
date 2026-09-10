"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, payload) => {
    const response = {
        success: payload.success ?? (statusCode >= 200 && statusCode < 300),
        message: payload.message,
        data: payload.data,
        meta: payload.meta,
        errors: payload.errors,
    };
    return res.status(statusCode).json(response);
};
exports.sendResponse = sendResponse;
