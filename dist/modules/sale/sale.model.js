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
exports.Sale = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const saleSchema = new mongoose_1.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceType: {
        type: String,
        enum: ['SIMPLIFIED', 'STANDARD_TAX', 'CREDIT_NOTE', 'DEBIT_NOTE'],
        default: 'SIMPLIFIED',
    },
    channel: {
        type: String,
        enum: ['POS_RETAIL', 'WHOLESALE', 'ONLINE'],
        default: 'POS_RETAIL',
    },
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, default: 'Walk-in Retail Customer' },
    customerVatNumber: { type: String },
    branchId: { type: String },
    cashierId: { type: String },
    items: [
        {
            productId: { type: String, required: true },
            sku: { type: String, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            unitPrice: { type: Number, required: true, min: 0 },
            discount: { type: Number, default: 0 },
            vatRate: { type: Number, default: 15 },
            vatAmount: { type: Number, required: true, default: 0 },
            subtotal: { type: Number, required: true, default: 0 },
            total: { type: Number, required: true, default: 0 },
        },
    ],
    subtotal: { type: Number, required: true, default: 0 },
    discountTotal: { type: Number, default: 0 },
    totalVat: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    paymentMethod: {
        type: String,
        enum: ['CASH', 'MADA', 'CREDIT_CARD', 'CREDIT_ACCOUNT', 'SPLIT'],
        default: 'CASH',
    },
    paidAmount: { type: Number, required: true, default: 0 },
    changeAmount: { type: Number, default: 0 },
    zatcaQrCode: { type: String, default: '' },
    zatcaStatus: {
        type: String,
        enum: ['REPORTED', 'CLEARED', 'PENDING', 'LOCAL_SAVED'],
        default: 'LOCAL_SAVED',
    },
    status: {
        type: String,
        enum: ['COMPLETED', 'HOLD', 'RETURNED', 'CANCELLED'],
        default: 'COMPLETED',
    },
    notes: { type: String },
}, { timestamps: true });
saleSchema.index({ invoiceNumber: 1 });
saleSchema.index({ createdAt: -1 });
exports.Sale = mongoose_1.default.model('Sale', saleSchema);
