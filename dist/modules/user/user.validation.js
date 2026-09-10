"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const index_js_1 = require("../../common/constants/index.js");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2, 'Full name must be at least 2 characters'),
        fullNameArabic: zod_1.z.string().optional(),
        email: zod_1.z.string().email('Invalid email address format'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        role: zod_1.z.nativeEnum(index_js_1.SYSTEM_ROLES).optional().default(index_js_1.SYSTEM_ROLES.SALES_POS_USER),
        phone: zod_1.z.string().optional(),
        companyId: zod_1.z.string().optional(),
        branchId: zod_1.z.string().optional(),
        warehouseId: zod_1.z.string().optional(),
        languagePreference: zod_1.z.enum(['en', 'ar']).optional().default('en'),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'User ID is required'),
    }),
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2).optional(),
        fullNameArabic: zod_1.z.string().optional(),
        role: zod_1.z.nativeEnum(index_js_1.SYSTEM_ROLES).optional(),
        phone: zod_1.z.string().optional(),
        branchId: zod_1.z.string().optional(),
        warehouseId: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
        languagePreference: zod_1.z.enum(['en', 'ar']).optional(),
    }),
});
