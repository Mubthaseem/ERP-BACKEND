import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  code: string;
  nameEn: string;
  nameAr?: string;
  customerType: 'RETAIL' | 'WHOLESALE' | 'CORPORATE';
  vatNumber?: string;      // 15-digit Saudi VAT / TRN
  crNumber?: string;
  email?: string;
  phone: string;
  buildingNo?: string;
  streetName?: string;
  district?: string;
  city: string;
  postalCode?: string;
  country: string;
  creditLimit: number;
  creditDays: number;
  currentBalance: number;  // Accounts Receivable balance
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
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
  },
  { timestamps: true }
);

customerSchema.index({ code: 1 });
customerSchema.index({ nameEn: 'text', nameAr: 'text', phone: 1 });

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema);
