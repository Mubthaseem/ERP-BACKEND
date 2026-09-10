import mongoose, { Document, Schema } from 'mongoose';

export interface ISaleItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  vatRate: number;
  vatAmount: number;
  subtotal: number;
  total: number;
}

export interface ISale extends Document {
  invoiceNumber: string;
  invoiceType: 'SIMPLIFIED' | 'STANDARD_TAX' | 'CREDIT_NOTE' | 'DEBIT_NOTE';
  channel: 'POS_RETAIL' | 'WHOLESALE' | 'ONLINE';
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  customerVatNumber?: string;
  branchId?: string;
  cashierId?: string;
  items: ISaleItem[];
  subtotal: number;
  discountTotal: number;
  totalVat: number;
  totalAmount: number;
  paymentMethod: 'CASH' | 'MADA' | 'CREDIT_CARD' | 'CREDIT_ACCOUNT' | 'SPLIT';
  paidAmount: number;
  changeAmount: number;
  zatcaQrCode: string;     // ZATCA Base64 TLV Encoded QR
  zatcaStatus: 'REPORTED' | 'CLEARED' | 'PENDING' | 'LOCAL_SAVED';
  status: 'COMPLETED' | 'HOLD' | 'RETURNED' | 'CANCELLED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new Schema<ISale>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceType: {
      type: String,
      enum: ['SIMPLIFIED', 'STANDARD_TAX', 'CREDIT_NOTE', 'DEBIT_NOTE'],
      default: 'SIMPLIFIED',
    },
    channel: {
      type: String,
      enum: ['POS_RETAIL', 'WHOLESALE', 'ONLINE'],
      default: 'POS_RETAIL',
    },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, default: 'Walk-in Retail Customer' },
    customerVatNumber: { type: String },
    branchId: { type: String },
    cashierId: { type: String },
    items: [
      {
        productId: { type: String, required: true },
        sku: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0 },
        vatRate: { type: Number, default: 15 },
        vatAmount: { type: Number, required: true, default: 0 },
        subtotal: { type: Number, required: true, default: 0 },
        total: { type: Number, required: true, default: 0 },
      },
    ],
    subtotal: { type: Number, required: true, default: 0 },
    discountTotal: { type: Number, default: 0 },
    totalVat: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'MADA', 'CREDIT_CARD', 'CREDIT_ACCOUNT', 'SPLIT'],
      default: 'CASH',
    },
    paidAmount: { type: Number, required: true, default: 0 },
    changeAmount: { type: Number, default: 0 },
    zatcaQrCode: { type: String, default: '' },
    zatcaStatus: {
      type: String,
      enum: ['REPORTED', 'CLEARED', 'PENDING', 'LOCAL_SAVED'],
      default: 'LOCAL_SAVED',
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'HOLD', 'RETURNED', 'CANCELLED'],
      default: 'COMPLETED',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

saleSchema.index({ invoiceNumber: 1 });
saleSchema.index({ createdAt: -1 });

export const Sale = mongoose.model<ISale>('Sale', saleSchema);
