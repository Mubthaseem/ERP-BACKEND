import mongoose, { Document, Schema } from 'mongoose';

// Chart of Accounts (COA)
export interface IAccount extends Document {
  code: string;
  nameEn: string;
  nameAr: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  balance: number;
  currency: string;
  isActive: boolean;
}

const accountSchema = new Schema<IAccount>(
  {
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
  },
  { timestamps: true }
);

// Expense Entries
export interface IExpense extends Document {
  expenseNumber: string;
  category: string;
  amount: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  paymentMethod: string;
  paidTo?: string;
  receiptUrl?: string;
  notes?: string;
  expenseDate: Date;
  status: 'PENDING' | 'APPROVED' | 'PAID';
}

const expenseSchema = new Schema<IExpense>(
  {
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
  },
  { timestamps: true }
);

export const Account = mongoose.model<IAccount>('Account', accountSchema);
export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
