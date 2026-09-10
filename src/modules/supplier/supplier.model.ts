import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplier extends Document {
  code: string;
  nameEn: string;
  nameAr?: string;
  vatNumber?: string;
  crNumber?: string;
  contactPerson?: string;
  email?: string;
  phone: string;
  city: string;
  country: string;
  paymentTerms: string;
  currentPayable: number;  // Accounts Payable balance
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema = new Schema<ISupplier>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    nameEn: { type: String, required: true, trim: true },
    nameAr: { type: String, trim: true },
    vatNumber: { type: String, trim: true },
    crNumber: { type: String, trim: true },
    contactPerson: { type: String },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true },
    city: { type: String, default: 'Riyadh' },
    country: { type: String, default: 'Saudi Arabia' },
    paymentTerms: { type: String, default: 'Net 30 Days' },
    currentPayable: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Supplier = mongoose.model<ISupplier>('Supplier', supplierSchema);
