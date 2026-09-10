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
exports.Payroll = exports.Employee = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const employeeSchema = new mongoose_1.Schema({
    employeeCode: { type: String, required: true, unique: true },
    nameEn: { type: String, required: true },
    nameAr: { type: String },
    nationalIdOrIqama: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    joiningDate: { type: Date, default: Date.now },
    basicSalary: { type: Number, required: true, default: 0 },
    housingAllowance: { type: Number, default: 0 },
    transportAllowance: { type: Number, default: 0 },
    otherAllowance: { type: Number, default: 0 },
    totalSalary: { type: Number, required: true, default: 0 },
    gosiDeduction: { type: Number, default: 0 },
    bankIban: { type: String, default: 'SA0380000000608010167519' },
    bankCode: { type: String, default: 'RJHI' },
    status: {
        type: String,
        enum: ['ACTIVE', 'ON_LEAVE', 'TERMINATED'],
        default: 'ACTIVE',
    },
}, { timestamps: true });
const payrollSchema = new mongoose_1.Schema({
    payrollNumber: { type: String, required: true, unique: true },
    salaryMonth: { type: String, required: true },
    staffCount: { type: Number, default: 0 },
    grossSalary: { type: Number, default: 0 },
    gosiDeductions: { type: Number, default: 0 },
    netSalaryPayable: { type: Number, default: 0 },
    currency: { type: String, default: 'SAR' },
    status: {
        type: String,
        enum: ['DRAFT', 'APPROVED', 'PAID'],
        default: 'PAID',
    },
    records: [
        {
            employeeId: { type: String },
            employeeCode: { type: String },
            name: { type: String },
            nationalId: { type: String },
            iban: { type: String },
            bankCode: { type: String },
            basicSalary: { type: Number, default: 0 },
            housingAllowance: { type: Number, default: 0 },
            otherAllowance: { type: Number, default: 0 },
            deductions: { type: Number, default: 0 },
            netSalary: { type: Number, default: 0 },
        },
    ],
}, { timestamps: true });
exports.Employee = mongoose_1.default.model('Employee', employeeSchema);
exports.Payroll = mongoose_1.default.model('Payroll', payrollSchema);
