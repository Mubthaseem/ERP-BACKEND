"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("./auth.service.js");
const response_js_1 = require("../../common/utils/response.js");
const auth_constants_js_1 = require("./auth.constants.js");
class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_js_1.AuthService.login(email, password);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                message: auth_constants_js_1.AUTH_MESSAGES.LOGIN_SUCCESS,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMe(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return (0, response_js_1.sendResponse)(res, 401, { success: false, message: 'Unauthorized' });
            }
            const user = await auth_service_js_1.AuthService.getMe(userId);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                message: auth_constants_js_1.AUTH_MESSAGES.PROFILE_RETRIEVED,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async changePassword(req, res, next) {
        try {
            const userId = req.user.userId;
            const { currentPassword, newPassword } = req.body;
            const result = await auth_service_js_1.AuthService.changePassword(userId, currentPassword, newPassword);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
