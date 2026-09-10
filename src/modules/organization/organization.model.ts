import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  nameEn: string;
  nameAr: string;
  type: 'COMPANY' | 'BRANCH' | 'WAREHOUSE' | 'SHOP';
  code: string;
  crNumber?: string;       // Commercial Registration (Saudi CR)
  vatNumber?: string;      // 15-digit ZATCA Tax Registration Number
  addressEn?: string;
  addressAr?: string;
  city?: string;
  country: string;
  currency: string;
  phone?: string;
  email?: string;
  parentId?: string;       // Parent company / branch
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    nameEn: { type: String, required: true, trim: true },
    nameAr: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['COMPANY', 'BRANCH', 'WAREHOUSE', 'SHOP'],
      required: true,
    },
    code: { type: String, required: true, unique: true, uppercase: true },
    crNumber: { type: String, trim: true },
    vatNumber: { type: String, trim: true },
    addressEn: { type: String },
    addressAr: { type: String },
    city: { type: String, default: 'Riyadh' },
    country: { type: String, default: 'Saudi Arabia' },
    currency: { type: String, default: 'SAR' },
    phone: { type: String },
    email: { type: String },
    parentId: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);
