"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingService = void 0;
const accounting_model_js_1 = require("./accounting.model.js");
const sale_model_js_1 = require("../sale/sale.model.js");
const purchase_model_js_1 = require("../purchase/purchase.model.js");
const ApiError_js_1 = require("../../common/errors/ApiError.js");
const pagination_js_1 = require("../../common/utils/pagination.js");
class AccountingService {
    static async getAccounts() {
        return await accounting_model_js_1.Account.find().sort({ code: 1 });
    }
    static async createAccount(data) {
        const existing = await accounting_model_js_1.Account.findOne({ code: data.code });
        if (existing)
            throw ApiError_js_1.ApiError.conflict(`Account code ${data.code} already exists`);
        return await accounting_model_js_1.Account.create(data);
    }
    static async recordExpense(data) {
        const count = await accounting_model_js_1.Expense.countDocuments();
        const expenseNumber = `EXP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
        const amount = Number(data.amount || 0);
        const vatRate = data.vatRate !== undefined ? Number(data.vatRate) : 15;
        const vatAmount = (amount * vatRate) / 100;
        const total = amount + vatAmount;
        return await accounting_model_js_1.Expense.create({
            ...data,
            expenseNumber,
            amount,
            vatRate,
            vatAmount: Number(vatAmount.toFixed(2)),
            total: Number(total.toFixed(2)),
        });
    }
    static async getExpenses(query) {
        const { page, limit, skip } = (0, pagination_js_1.getPagination)(query);
        const filter = {};
        if (query.category)
            filter.category = query.category;
        const [expenses, total] = await Promise.all([
            accounting_model_js_1.Expense.find(filter).skip(skip).limit(limit).sort({ expenseDate: -1 }),
            accounting_model_js_1.Expense.countDocuments(filter),
        ]);
        return { expenses, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    static async getFinancialSummary() {
        // 1. Total Revenue from Sales
        const salesAgg = await sale_model_js_1.Sale.aggregate([
            { $match: { status: 'COMPLETED' } },
            { $group: { _id: null, totalSales: { $sum: '$subtotal' }, totalVatOutput: { $sum: '$totalVat' } } },
        ]);
        // 2. Cost of Goods / Purchases
        const purchaseAgg = await purchase_model_js_1.Purchase.aggregate([
            { $match: { status: { $in: ['APPROVED', 'RECEIVED'] } } },
            { $group: { _id: null, totalPurchases: { $sum: '$subtotal' }, totalVatInput: { $sum: '$totalVat' } } },
        ]);
        // 3. Operating Expenses
        const expenseAgg = await accounting_model_js_1.Expense.aggregate([
            { $match: { status: { $in: ['APPROVED', 'PAID'] } } },
            { $group: { _id: null, totalExpenses: { $sum: '$amount' }, totalVatExpense: { $sum: '$vatAmount' } } },
        ]);
        const revenue = salesAgg[0]?.totalSales || 0;
        const cogs = purchaseAgg[0]?.totalPurchases || 0;
        const grossProfit = revenue - cogs;
        const expenses = expenseAgg[0]?.totalExpenses || 0;
        const netProfit = grossProfit - expenses;
        const outputVat = salesAgg[0]?.totalVatOutput || 0;
        const inputVat = (purchaseAgg[0]?.totalVatInput || 0) + (expenseAgg[0]?.totalVatExpense || 0);
        const netVatPayable = outputVat - inputVat;
        return {
            revenue: Number(revenue.toFixed(2)),
            cogs: Number(cogs.toFixed(2)),
            grossProfit: Number(grossProfit.toFixed(2)),
            expenses: Number(expenses.toFixed(2)),
            netProfit: Number(netProfit.toFixed(2)),
            vat: {
                outputVatCollected: Number(outputVat.toFixed(2)),
                inputVatPaid: Number(inputVat.toFixed(2)),
                netVatPayableToZatca: Number(netVatPayable.toFixed(2)),
            },
        };
    }
}
exports.AccountingService = AccountingService;
