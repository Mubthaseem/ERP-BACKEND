import { Sale, ISale } from './sale.model.js';
import { Product } from '../product/product.model.js';
import { Customer } from '../customer/customer.model.js';
import { generateZatcaTlvQrCode } from './zatca.js';
import { ApiError } from '../../common/errors/ApiError.js';
import { getPagination, IPaginationOptions } from '../../common/utils/pagination.js';

export class SaleService {
  static async createSaleInvoice(data: Partial<ISale>) {
    // Generate Invoice Number e.g. INV-2026-0001 or POS-2026-0001
    const count = await Sale.countDocuments();
    const prefix = data.channel === 'POS_RETAIL' ? 'POS' : 'INV';
    const invoiceNumber = `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    let subtotal = 0;
    let totalVat = 0;

    // Process line items & check stock
    const items = [];
    for (const item of data.items || []) {
      const lineSubtotal = item.quantity * item.unitPrice - (item.discount || 0);
      const vatRate = item.vatRate !== undefined ? item.vatRate : 15;
      const vatAmount = (lineSubtotal * vatRate) / 100;
      const total = lineSubtotal + vatAmount;

      subtotal += lineSubtotal;
      totalVat += vatAmount;

      items.push({
        ...item,
        vatRate,
        vatAmount: Number(vatAmount.toFixed(2)),
        subtotal: Number(lineSubtotal.toFixed(2)),
        total: Number(total.toFixed(2)),
      });

      // Deduct stock in MongoDB
      const product = await Product.findOne({
        $or: [{ _id: item.productId }, { sku: item.sku }],
      });
      if (product) {
        product.currentStock = Math.max(0, product.currentStock - item.quantity);
        if (product.currentStock === 0) {
          product.status = 'Out of Stock';
        } else if (product.currentStock <= (product.reorderLevel || 5)) {
          product.status = 'Low Stock';
        }
        await product.save();
      }
    }

    const totalAmount = subtotal + totalVat;
    const paidAmount = data.paidAmount !== undefined ? data.paidAmount : totalAmount;
    const changeAmount = Math.max(0, paidAmount - totalAmount);

    // Generate compliant ZATCA Base64 TLV QR Code
    const zatcaQrCode = generateZatcaTlvQrCode({
      sellerName: 'Saudi Arabia ERP Enterprise',
      vatNumber: '310123456700003', // Official 15-digit ZATCA format
      timestamp: new Date().toISOString(),
      invoiceTotal: totalAmount.toFixed(2),
      vatTotal: totalVat.toFixed(2),
    });

    // If Credit Account, update customer balance in MongoDB
    if (data.paymentMethod === 'CREDIT_ACCOUNT' && data.customerId) {
      await Customer.findByIdAndUpdate(data.customerId, {
        $inc: { currentBalance: totalAmount },
      });
    }

    const sale = await Sale.create({
      ...data,
      invoiceNumber,
      items,
      subtotal: Number(subtotal.toFixed(2)),
      totalVat: Number(totalVat.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      paidAmount: Number(paidAmount.toFixed(2)),
      changeAmount: Number(changeAmount.toFixed(2)),
      zatcaQrCode,
      zatcaStatus: 'LOCAL_SAVED',
    });

    return sale;
  }

  static async getSales(query: { search?: string; channel?: string; fromDate?: string; toDate?: string } & IPaginationOptions) {
    const { page, limit, skip } = getPagination(query);
    const filter: any = {};
    if (query.search) {
      filter.$or = [
        { invoiceNumber: { $regex: query.search, $options: 'i' } },
        { customerName: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.channel) filter.channel = query.channel;
    if (query.fromDate || query.toDate) {
      filter.createdAt = {};
      if (query.fromDate) filter.createdAt.$gte = new Date(query.fromDate);
      if (query.toDate) filter.createdAt.$lte = new Date(query.toDate);
    }

    const [sales, total] = await Promise.all([
      Sale.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Sale.countDocuments(filter),
    ]);

    return { sales, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async getSaleById(id: string) {
    const sale = await Sale.findById(id);
    if (!sale) throw ApiError.notFound('Sale invoice not found');
    return sale;
  }
}
