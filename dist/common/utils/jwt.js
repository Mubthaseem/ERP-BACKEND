"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../../config/env.js");
const generateToken = (payload, expiresIn = env_js_1.ENV.JWT_EXPIRES_IN) => {
    const options = { expiresIn: expiresIn };
    return jsonwebtoken_1.default.sign(payload, env_js_1.ENV.JWT_SECRET, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_js_1.ENV.JWT_SECRET);
};
exports.verifyToken = verifyToken;
