import { Account, Expense, IAccount, IExpense } from './accounting.model.js';
import { Sale } from '../sale/sale.model.js';
import { Purchase } from '../purchase/purchase.model.js';
import { ApiError } from '../../common/errors/ApiError.js';
import { getPagination, IPaginationOptions } from '../../common/utils/pagination.js';

export class AccountingService {
  static async getAccounts() {
    return await Account.find().sort({ code: 1 });
  }

  static async createAccount(data: Partial<IAccount>) {
    const existing = await Account.findOne({ code: data.code });
    if (existing) throw ApiError.conflict(`Account code ${data.code} already exists`);
    return await Account.create(data);
  }

  static async recordExpense(data: Partial<IExpense>) {
    const count = await Expense.countDocuments();
    const expenseNumber = `EXP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const amount = Number(data.amount || 0);
    const vatRate = data.vatRate !== undefined ? Number(data.vatRate) : 15;
    const vatAmount = (amount * vatRate) / 100;
    const total = amount + vatAmount;

    return await Expense.create({
      ...data,
      expenseNumber,
      amount,
      vatRate,
      vatAmount: Number(vatAmount.toFixed(2)),
      total: Number(total.toFixed(2)),
    });
  }

  static async getExpenses(query: { category?: string } & IPaginationOptions) {
    const { page, limit, skip } = getPagination(query);
    const filter: any = {};
    if (query.category) filter.category = query.category;

    const [expenses, total] = await Promise.all([
      Expense.find(filter).skip(skip).limit(limit).sort({ expenseDate: -1 }),
      Expense.countDocuments(filter),
    ]);

    return { expenses, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async getFinancialSummary() {
    // 1. Total Revenue from Sales
    const salesAgg = await Sale.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, totalSales: { $sum: '$subtotal' }, totalVatOutput: { $sum: '$totalVat' } } },
    ]);

    // 2. Cost of Goods / Purchases
    const purchaseAgg = await Purchase.aggregate([
      { $match: { status: { $in: ['APPROVED', 'RECEIVED'] } } },
      { $group: { _id: null, totalPurchases: { $sum: '$subtotal' }, totalVatInput: { $sum: '$totalVat' } } },
    ]);

    // 3. Operating Expenses
    const expenseAgg = await Expense.aggregate([
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
