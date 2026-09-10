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
exports.Expense = exports.Account = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const accountSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    nameEn: { type: String, required: true },
    nameAr: { type: String, required: true },
    type: {
        type: String,
        enum: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'],
        required: true,
    },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'SAR' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const expenseSchema = new mongoose_1.Schema({
    expenseNumber: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    vatRate: { type: Number, default: 15 },
    vatAmount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Bank Transfer' },
    paidTo: { type: String },
    receiptUrl: { type: String },
    notes: { type: String },
    expenseDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'PAID'],
        default: 'APPROVED',
    },
}, { timestamps: true });
exports.Account = mongoose_1.default.model('Account', accountSchema);
exports.Expense = mongoose_1.default.model('Expense', expenseSchema);
