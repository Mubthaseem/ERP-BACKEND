"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleService = void 0;
const sale_model_js_1 = require("./sale.model.js");
const product_model_js_1 = require("../product/product.model.js");
const customer_model_js_1 = require("../customer/customer.model.js");
const zatca_js_1 = require("./zatca.js");
const ApiError_js_1 = require("../../common/errors/ApiError.js");
const pagination_js_1 = require("../../common/utils/pagination.js");
class SaleService {
    static async createSaleInvoice(data) {
        // Generate Invoice Number e.g. INV-2026-0001 or POS-2026-0001
        const count = await sale_model_js_1.Sale.countDocuments();
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
            const product = await product_model_js_1.Product.findOne({
                $or: [{ _id: item.productId }, { sku: item.sku }],
            });
            if (product) {
                product.currentStock = Math.max(0, product.currentStock - item.quantity);
                if (product.currentStock === 0) {
                    product.status = 'Out of Stock';
                }
                else if (product.currentStock <= (product.reorderLevel || 5)) {
                    product.status = 'Low Stock';
                }
                await product.save();
            }
        }
        const totalAmount = subtotal + totalVat;
        const paidAmount = data.paidAmount !== undefined ? data.paidAmount : totalAmount;
        const changeAmount = Math.max(0, paidAmount - totalAmount);
        // Generate compliant ZATCA Base64 TLV QR Code
        const zatcaQrCode = (0, zatca_js_1.generateZatcaTlvQrCode)({
            sellerName: 'Saudi Arabia ERP Enterprise',
            vatNumber: '310123456700003', // Official 15-digit ZATCA format
            timestamp: new Date().toISOString(),
            invoiceTotal: totalAmount.toFixed(2),
            vatTotal: totalVat.toFixed(2),
        });
        // If Credit Account, update customer balance in MongoDB
        if (data.paymentMethod === 'CREDIT_ACCOUNT' && data.customerId) {
            await customer_model_js_1.Customer.findByIdAndUpdate(data.customerId, {
                $inc: { currentBalance: totalAmount },
            });
        }
        const sale = await sale_model_js_1.Sale.create({
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
    static async getSales(query) {
        const { page, limit, skip } = (0, pagination_js_1.getPagination)(query);
        const filter = {};
        if (query.search) {
            filter.$or = [
                { invoiceNumber: { $regex: query.search, $options: 'i' } },
                { customerName: { $regex: query.search, $options: 'i' } },
            ];
        }
        if (query.channel)
            filter.channel = query.channel;
        if (query.fromDate || query.toDate) {
            filter.createdAt = {};
            if (query.fromDate)
                filter.createdAt.$gte = new Date(query.fromDate);
            if (query.toDate)
                filter.createdAt.$lte = new Date(query.toDate);
        }
        const [sales, total] = await Promise.all([
            sale_model_js_1.Sale.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            sale_model_js_1.Sale.countDocuments(filter),
        ]);
        return { sales, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    static async getSaleById(id) {
        const sale = await sale_model_js_1.Sale.findById(id);
        if (!sale)
            throw ApiError_js_1.ApiError.notFound('Sale invoice not found');
        return sale;
    }
}
exports.SaleService = SaleService;
