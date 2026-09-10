"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_js_1 = require("../user/user.model.js");
const hash_js_1 = require("../../common/utils/hash.js");
const jwt_js_1 = require("../../common/utils/jwt.js");
const ApiError_js_1 = require("../../common/errors/ApiError.js");
const auth_constants_js_1 = require("./auth.constants.js");
class AuthService {
    static async login(email, password) {
        const user = await user_model_js_1.User.findOne({ email }).select('+passwordHash');
        if (!user) {
            throw ApiError_js_1.ApiError.unauthorized(auth_constants_js_1.AUTH_MESSAGES.INVALID_CREDENTIALS);
        }
        if (!user.isActive) {
            throw ApiError_js_1.ApiError.forbidden(auth_constants_js_1.AUTH_MESSAGES.ACCOUNT_INACTIVE);
        }
        const isMatch = await (0, hash_js_1.comparePassword)(password, user.passwordHash);
        if (!isMatch) {
            throw ApiError_js_1.ApiError.unauthorized(auth_constants_js_1.AUTH_MESSAGES.INVALID_CREDENTIALS);
        }
        // Update last login
        user.lastLoginAt = new Date();
        await user.save();
        const token = (0, jwt_js_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            branchId: user.branchId,
            warehouseId: user.warehouseId,
        });
        const userObj = user.toObject();
        delete userObj.passwordHash;
        return {
            token,
            user: userObj,
        };
    }
    static async getMe(userId) {
        const user = await user_model_js_1.User.findById(userId);
        if (!user)
            throw ApiError_js_1.ApiError.notFound('User not found');
        return user;
    }
    static async changePassword(userId, currentPass, newPass) {
        const user = await user_model_js_1.User.findById(userId).select('+passwordHash');
        if (!user)
            throw ApiError_js_1.ApiError.notFound('User not found');
        const isMatch = await (0, hash_js_1.comparePassword)(currentPass, user.passwordHash);
        if (!isMatch) {
            throw ApiError_js_1.ApiError.badRequest('Current password provided is incorrect');
        }
        user.passwordHash = await (0, hash_js_1.hashPassword)(newPass);
        await user.save();
        return { message: auth_constants_js_1.AUTH_MESSAGES.PASSWORD_CHANGED };
    }
}
exports.AuthService = AuthService;
