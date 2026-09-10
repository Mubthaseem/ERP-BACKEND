"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_js_1 = require("./user.model.js");
const hash_js_1 = require("../../common/utils/hash.js");
const ApiError_js_1 = require("../../common/errors/ApiError.js");
const user_constants_js_1 = require("./user.constants.js");
const pagination_js_1 = require("../../common/utils/pagination.js");
class UserService {
    static async createUser(userData) {
        const existing = await user_model_js_1.User.findOne({ email: userData.email });
        if (existing) {
            throw ApiError_js_1.ApiError.conflict(user_constants_js_1.USER_MESSAGES.ALREADY_EXISTS);
        }
        const passwordHash = await (0, hash_js_1.hashPassword)(userData.password || 'SaudiERP@123');
        const newUser = await user_model_js_1.User.create({
            ...userData,
            passwordHash,
        });
        const userObj = newUser.toObject();
        delete userObj.passwordHash;
        return userObj;
    }
    static async getUsers(query) {
        const { page, limit, skip } = (0, pagination_js_1.getPagination)(query);
        const filter = {};
        if (query.search) {
            filter.$or = [
                { fullName: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
            ];
        }
        if (query.role)
            filter.role = query.role;
        if (query.isActive !== undefined)
            filter.isActive = query.isActive;
        const [users, total] = await Promise.all([
            user_model_js_1.User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            user_model_js_1.User.countDocuments(filter),
        ]);
        return {
            users,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getUserById(id) {
        const user = await user_model_js_1.User.findById(id);
        if (!user)
            throw ApiError_js_1.ApiError.notFound(user_constants_js_1.USER_MESSAGES.NOT_FOUND);
        return user;
    }
    static async updateUser(id, updateData) {
        const user = await user_model_js_1.User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!user)
            throw ApiError_js_1.ApiError.notFound(user_constants_js_1.USER_MESSAGES.NOT_FOUND);
        return user;
    }
    static async deleteUser(id) {
        const user = await user_model_js_1.User.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!user)
            throw ApiError_js_1.ApiError.notFound(user_constants_js_1.USER_MESSAGES.NOT_FOUND);
        return { message: user_constants_js_1.USER_MESSAGES.DELETED };
    }
}
exports.UserService = UserService;
