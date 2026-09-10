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
exports.Purchase = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const purchaseSchema = new mongoose_1.Schema({
    poNumber: { type: String, required: true, unique: true },
    supplierId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    supplierName: { type: String, required: true },
    warehouseId: { type: String },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    status: {
        type: String,
        enum: ['DRAFT', 'APPROVED', 'RECEIVED', 'CANCELLED'],
        default: 'DRAFT',
    },
    paymentStatus: {
        type: String,
        enum: ['UNPAID', 'PARTIAL', 'PAID'],
        default: 'UNPAID',
    },
    items: [
        {
            productId: { type: String, required: true },
            sku: { type: String, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            unitCost: { type: Number, required: true, min: 0 },
            discount: { type: Number, default: 0 },
            vatRate: { type: Number, default: 15 },
            vatAmount: { type: Number, required: true, default: 0 },
            total: { type: Number, required: true, default: 0 },
        },
    ],
    subtotal: { type: Number, required: true, default: 0 },
    totalVat: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    paidAmount: { type: Number, default: 0 },
    notes: { type: String },
}, { timestamps: true });
exports.Purchase = mongoose_1.default.model('Purchase', purchaseSchema);
