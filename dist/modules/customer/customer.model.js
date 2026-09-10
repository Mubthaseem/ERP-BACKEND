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
exports.Customer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const customerSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    nameEn: { type: String, required: true, trim: true },
    nameAr: { type: String, trim: true },
    customerType: {
        type: String,
        enum: ['RETAIL', 'WHOLESALE', 'CORPORATE'],
        default: 'RETAIL',
    },
    vatNumber: { type: String, trim: true },
    crNumber: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true },
    buildingNo: { type: String },
    streetName: { type: String },
    district: { type: String },
    city: { type: String, default: 'Riyadh' },
    postalCode: { type: String },
    country: { type: String, default: 'Saudi Arabia' },
    creditLimit: { type: Number, default: 0 },
    creditDays: { type: Number, default: 30 },
    currentBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
customerSchema.index({ code: 1 });
customerSchema.index({ nameEn: 'text', nameAr: 'text', phone: 1 });
exports.Customer = mongoose_1.default.model('Customer', customerSchema);
