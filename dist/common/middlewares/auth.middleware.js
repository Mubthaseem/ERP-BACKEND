"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const jwt_js_1 = require("../utils/jwt.js");
const ApiError_js_1 = require("../errors/ApiError.js");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(ApiError_js_1.ApiError.unauthorized('Authentication token missing or malformed'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, jwt_js_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        next(ApiError_js_1.ApiError.unauthorized(`Invalid or expired authentication token: ${error.message}`));
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(ApiError_js_1.ApiError.unauthorized('User not authenticated'));
        }
        if (!roles.includes(req.user.role)) {
            return next(ApiError_js_1.ApiError.forbidden(`User role [${req.user.role}] is not authorized to access this resource`));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
