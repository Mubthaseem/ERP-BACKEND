"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const index_js_1 = require("../../common/constants/index.js");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        sku: zod_1.z.string().min(1, 'SKU is required'),
        name: zod_1.z.string().min(2, 'English name is required'),
        nameArabic: zod_1.z.string().optional(),
        category: zod_1.z.string().default('General'),
        subcategory: zod_1.z.string().optional(),
        brand: zod_1.z.string().optional(),
        barcodes: zod_1.z.array(zod_1.z.string()).optional().default([]),
        unit: zod_1.z.string().optional().default('PCS'),
        costPrice: zod_1.z.number().nonnegative().optional().default(0),
        retailPrice: zod_1.z.number().nonnegative('Retail price must be non-negative'),
        wholesalePrice: zod_1.z.number().nonnegative().optional().default(0),
        vatCategory: zod_1.z.nativeEnum(index_js_1.TAX_CATEGORIES).optional().default(index_js_1.TAX_CATEGORIES.STANDARD_15),
        vatRate: zod_1.z.number().optional().default(15),
        currentStock: zod_1.z.number().nonnegative().optional().default(0),
        reorderLevel: zod_1.z.number().nonnegative().optional().default(5),
        warehouseId: zod_1.z.string().optional(),
        shopId: zod_1.z.string().optional(),
        itemStatus: zod_1.z.nativeEnum(index_js_1.ITEM_STATUSES).optional().default(index_js_1.ITEM_STATUSES.ACTIVE),
        description: zod_1.z.string().optional(),
    }),
});
exports.updateProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Product ID is required'),
    }),
    body: zod_1.z.object({
        sku: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        nameArabic: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        subcategory: zod_1.z.string().optional(),
        brand: zod_1.z.string().optional(),
        barcodes: zod_1.z.array(zod_1.z.string()).optional(),
        unit: zod_1.z.string().optional(),
        costPrice: zod_1.z.number().nonnegative().optional(),
        retailPrice: zod_1.z.number().nonnegative().optional(),
        wholesalePrice: zod_1.z.number().nonnegative().optional(),
        vatCategory: zod_1.z.nativeEnum(index_js_1.TAX_CATEGORIES).optional(),
        vatRate: zod_1.z.number().optional(),
        currentStock: zod_1.z.number().nonnegative().optional(),
        reorderLevel: zod_1.z.number().nonnegative().optional(),
        warehouseId: zod_1.z.string().optional(),
        shopId: zod_1.z.string().optional(),
        itemStatus: zod_1.z.nativeEnum(index_js_1.ITEM_STATUSES).optional(),
        description: zod_1.z.string().optional(),
    }),
});
