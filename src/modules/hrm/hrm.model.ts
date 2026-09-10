import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  employeeCode: string;
  nameEn: string;
  nameAr?: string;
  nationalIdOrIqama: string;
  department: string;
  designation: string;
  joiningDate: Date;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  totalSalary: number;
  gosiDeduction: number;
  bankIban?: string;
  bankCode?: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
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
  },
  { timestamps: true }
);

export interface IPayrollRecord {
  employeeId: string;
  employeeCode: string;
  name: string;
  nationalId: string;
  iban: string;
  bankCode: string;
  basicSalary: number;
  housingAllowance: number;
  otherAllowance: number;
  deductions: number;
  netSalary: number;
}

export interface IPayroll extends Document {
  payrollNumber: string;
  salaryMonth: string; // YYYY-MM e.g. 2026-09
  staffCount: number;
  grossSalary: number;
  gosiDeductions: number;
  netSalaryPayable: number;
  currency: string;
  status: 'DRAFT' | 'APPROVED' | 'PAID';
  records: IPayrollRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const payrollSchema = new Schema<IPayroll>(
  {
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
  },
  { timestamps: true }
);

export const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);
export const Payroll = mongoose.model<IPayroll>('Payroll', payrollSchema);
