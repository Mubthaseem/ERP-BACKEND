import mongoose, { Document, Schema } from 'mongoose';
import { TAX_CATEGORIES, ITEM_STATUSES, STOCK_STATUSES } from '../../common/constants/index.js';

export interface IProduct extends Document {
  sku: string;
  name: string;
  nameArabic?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  barcodes: string[];
  unit: string;
  costPrice: number;
  retailPrice: number;
  wholesalePrice: number;
  vatCategory: string;
  vatRate: number;
  currentStock: number;
  reorderLevel: number;
  warehouseId?: string;
  shopId?: string;
  status: string;
  itemStatus: string;
  imageUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    sku: {
      type: String,
      required: [true, 'SKU code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Product English name is required'],
      trim: true,
    },
    nameArabic: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: 'General',
    },
    subcategory: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    barcodes: {
      type: [String],
      default: [],
    },
    unit: {
      type: String,
      default: 'PCS',
    },
    costPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    retailPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    wholesalePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    vatCategory: {
      type: String,
      enum: Object.values(TAX_CATEGORIES),
      default: TAX_CATEGORIES.STANDARD_15,
    },
    vatRate: {
      type: Number,
      default: 15,
    },
    currentStock: {
      type: Number,
      default: 0,
    },
    reorderLevel: {
      type: Number,
      default: 5,
    },
    warehouseId: {
      type: String,
    },
    shopId: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(STOCK_STATUSES),
      default: STOCK_STATUSES.IN_STOCK,
    },
    itemStatus: {
      type: String,
      enum: Object.values(ITEM_STATUSES),
      default: ITEM_STATUSES.ACTIVE,
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ sku: 1 });
productSchema.index({ name: 'text', nameArabic: 'text' });
productSchema.index({ barcodes: 1 });
productSchema.index({ category: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
