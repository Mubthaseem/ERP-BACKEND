"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const index_js_1 = require("../../common/constants/index.js");
const productSchema = new mongoose_1.Schema({
    sku: {
        type: String,
        required: [true, 'SKU code is required'],
        unique: true,
        trim: true,
        uppercase: true,
    },
    name: {
        type: String,
        required: [true, 'Product English name is required'],
        trim: true,
    },
    nameArabic: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        default: 'General',
    },
    subcategory: {
        type: String,
        trim: true,
    },
    brand: {
        type: String,
        trim: true,
    },
    barcodes: {
        type: [String],
        default: [],
    },
    unit: {
        type: String,
        default: 'PCS',
    },
    costPrice: {
        type: Number,
        default: 0,
        min: 0,
    },
    retailPrice: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    wholesalePrice: {
        type: Number,
        default: 0,
        min: 0,
    },
    vatCategory: {
        type: String,
        enum: Object.values(index_js_1.TAX_CATEGORIES),
        default: index_js_1.TAX_CATEGORIES.STANDARD_15,
    },
    vatRate: {
        type: Number,
        default: 15,
    },
    currentStock: {
        type: Number,
        default: 0,
    },
    reorderLevel: {
        type: Number,
        default: 5,
    },
    warehouseId: {
        type: String,
    },
    shopId: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(index_js_1.STOCK_STATUSES),
        default: index_js_1.STOCK_STATUSES.IN_STOCK,
    },
    itemStatus: {
        type: String,
        enum: Object.values(index_js_1.ITEM_STATUSES),
        default: index_js_1.ITEM_STATUSES.ACTIVE,
    },
    imageUrl: {
        type: String,
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
});
productSchema.index({ sku: 1 });
productSchema.index({ name: 'text', nameArabic: 'text' });
productSchema.index({ barcodes: 1 });
productSchema.index({ category: 1 });
exports.Product = mongoose_1.default.model('Product', productSchema);
