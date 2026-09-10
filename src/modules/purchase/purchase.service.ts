import { Purchase, IPurchase } from './purchase.model.js';
import { Product } from '../product/product.model.js';
import { Supplier } from '../supplier/supplier.model.js';
import { ApiError } from '../../common/errors/ApiError.js';
import { getPagination, IPaginationOptions } from '../../common/utils/pagination.js';

export class PurchaseService {
  static async createPurchaseOrder(data: Partial<IPurchase>) {
    // Generate unique PO number e.g. PO-2026-0001
    const count = await Purchase.countDocuments();
    const poNumber = `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Calculate item VAT (15%) and line totals
    let subtotal = 0;
    let totalVat = 0;

    const items = (data.items || []).map((item) => {
      const lineSubtotal = item.quantity * item.unitCost - (item.discount || 0);
      const vatRate = item.vatRate !== undefined ? item.vatRate : 15;
      const vatAmount = (lineSubtotal * vatRate) / 100;
      const total = lineSubtotal + vatAmount;

      subtotal += lineSubtotal;
      totalVat += vatAmount;

      return {
        ...item,
        vatRate,
        vatAmount: Number(vatAmount.toFixed(2)),
        total: Number(total.toFixed(2)),
      };
    });

    const totalAmount = subtotal + totalVat;

    const purchase = await Purchase.create({
      ...data,
      poNumber,
      items,
      subtotal: Number(subtotal.toFixed(2)),
      totalVat: Number(totalVat.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
    });

    return purchase;
  }

  static async receiveGoods(purchaseId: string) {
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) throw ApiError.notFound('Purchase order not found');

    if (purchase.status === 'RECEIVED') {
      throw ApiError.badRequest('Goods have already been received for this PO');
    }

    // 1. Update stock levels for each product in MongoDB
    for (const item of purchase.items) {
      const product = await Product.findOne({
        $or: [{ _id: item.productId }, { sku: item.sku }],
      });
      if (product) {
        product.currentStock += item.quantity;
        if (product.currentStock > (product.reorderLevel || 5)) {
          product.status = 'In Stock';
        }
        await product.save();
      }
    }

    // 2. Update supplier payable balance in MongoDB
    if (purchase.supplierId) {
      await Supplier.findByIdAndUpdate(purchase.supplierId, {
        $inc: { currentPayable: purchase.totalAmount },
      });
    }

    purchase.status = 'RECEIVED';
    await purchase.save();

    return purchase;
  }

  static async getPurchases(query: { search?: string; status?: string } & IPaginationOptions) {
    const { page, limit, skip } = getPagination(query);
    const filter: any = {};
    if (query.search) {
      filter.$or = [
        { poNumber: { $regex: query.search, $options: 'i' } },
        { supplierName: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.status) filter.status = query.status;

    const [purchases, total] = await Promise.all([
      Purchase.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Purchase.countDocuments(filter),
    ]);

    return { purchases, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async getPurchaseById(id: string) {
    const purchase = await Purchase.findById(id);
    if (!purchase) throw ApiError.notFound('Purchase order not found');
    return purchase;
  }
}
