"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_js_1 = require("./user.service.js");
const response_js_1 = require("../../common/utils/response.js");
const user_constants_js_1 = require("./user.constants.js");
class UserController {
    static async createUser(req, res, next) {
        try {
            const user = await user_service_js_1.UserService.createUser(req.body);
            return (0, response_js_1.sendResponse)(res, 201, {
                success: true,
                message: user_constants_js_1.USER_MESSAGES.CREATED,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUsers(req, res, next) {
        try {
            const result = await user_service_js_1.UserService.getUsers(req.query);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: result.users,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserById(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const user = await user_service_js_1.UserService.getUserById(id);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateUser(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const user = await user_service_js_1.UserService.updateUser(id, req.body);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                message: user_constants_js_1.USER_MESSAGES.UPDATED,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteUser(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await user_service_js_1.UserService.deleteUser(id);
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
exports.UserController = UserController;
