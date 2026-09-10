import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchaseItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitCost: number;
  discount: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

export interface IPurchase extends Document {
  poNumber: string;
  supplierId: mongoose.Types.ObjectId;
  supplierName: string;
  warehouseId?: string;
  orderDate: Date;
  deliveryDate?: Date;
  status: 'DRAFT' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  items: IPurchaseItem[];
  subtotal: number;
  totalVat: number;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseSchema = new Schema<IPurchase>(
  {
    poNumber: { type: String, required: true, unique: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    supplierName: { type: String, required: true },
    warehouseId: { type: String },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    status: {
      type: String,
      enum: ['DRAFT', 'APPROVED', 'RECEIVED', 'CANCELLED'],
      default: 'DRAFT',
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PARTIAL', 'PAID'],
      default: 'UNPAID',
    },
    items: [
      {
        productId: { type: String, required: true },
        sku: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitCost: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0 },
        vatRate: { type: Number, default: 15 },
        vatAmount: { type: Number, required: true, default: 0 },
        total: { type: Number, required: true, default: 0 },
      },
    ],
    subtotal: { type: Number, required: true, default: 0 },
    totalVat: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    paidAmount: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Purchase = mongoose.model<IPurchase>('Purchase', purchaseSchema);
