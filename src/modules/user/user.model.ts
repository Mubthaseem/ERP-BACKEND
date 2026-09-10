import mongoose, { Document, Schema } from 'mongoose';
import { SYSTEM_ROLES, SystemRole } from '../../common/constants/index.js';

export interface IUser extends Document {
  fullName: string;
  fullNameArabic?: string;
  email: string;
  passwordHash: string;
  role: SystemRole;
  phone?: string;
  companyId?: string;
  branchId?: string;
  warehouseId?: string;
  isActive: boolean;
  languagePreference: 'en' | 'ar';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    fullNameArabic: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(SYSTEM_ROLES),
      default: SYSTEM_ROLES.SALES_POS_USER,
    },
    phone: {
      type: String,
      trim: true,
    },
    companyId: {
      type: String,
      trim: true,
    },
    branchId: {
      type: String,
      trim: true,
    },
    warehouseId: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    languagePreference: {
      type: String,
      enum: ['en', 'ar'],
      default: 'en',
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ branchId: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
