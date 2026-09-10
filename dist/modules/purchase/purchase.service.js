"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseService = void 0;
const purchase_model_js_1 = require("./purchase.model.js");
const product_model_js_1 = require("../product/product.model.js");
const supplier_model_js_1 = require("../supplier/supplier.model.js");
const ApiError_js_1 = require("../../common/errors/ApiError.js");
const pagination_js_1 = require("../../common/utils/pagination.js");
class PurchaseService {
    static async createPurchaseOrder(data) {
        // Generate unique PO number e.g. PO-2026-0001
        const count = await purchase_model_js_1.Purchase.countDocuments();
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
        const purchase = await purchase_model_js_1.Purchase.create({
            ...data,
            poNumber,
            items,
            subtotal: Number(subtotal.toFixed(2)),
            totalVat: Number(totalVat.toFixed(2)),
            totalAmount: Number(totalAmount.toFixed(2)),
        });
        return purchase;
    }
    static async receiveGoods(purchaseId) {
        const purchase = await purchase_model_js_1.Purchase.findById(purchaseId);
        if (!purchase)
            throw ApiError_js_1.ApiError.notFound('Purchase order not found');
        if (purchase.status === 'RECEIVED') {
            throw ApiError_js_1.ApiError.badRequest('Goods have already been received for this PO');
        }
        // 1. Update stock levels for each product in MongoDB
        for (const item of purchase.items) {
            const product = await product_model_js_1.Product.findOne({
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
            await supplier_model_js_1.Supplier.findByIdAndUpdate(purchase.supplierId, {
                $inc: { currentPayable: purchase.totalAmount },
            });
        }
        purchase.status = 'RECEIVED';
        await purchase.save();
        return purchase;
    }
    static async getPurchases(query) {
        const { page, limit, skip } = (0, pagination_js_1.getPagination)(query);
        const filter = {};
        if (query.search) {
            filter.$or = [
                { poNumber: { $regex: query.search, $options: 'i' } },
                { supplierName: { $regex: query.search, $options: 'i' } },
            ];
        }
        if (query.status)
            filter.status = query.status;
        const [purchases, total] = await Promise.all([
            purchase_model_js_1.Purchase.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            purchase_model_js_1.Purchase.countDocuments(filter),
        ]);
        return { purchases, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    static async getPurchaseById(id) {
        const purchase = await purchase_model_js_1.Purchase.findById(id);
        if (!purchase)
            throw ApiError_js_1.ApiError.notFound('Purchase order not found');
        return purchase;
    }
}
exports.PurchaseService = PurchaseService;
