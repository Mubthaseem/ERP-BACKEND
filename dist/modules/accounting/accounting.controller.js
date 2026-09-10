"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingController = void 0;
const accounting_service_js_1 = require("./accounting.service.js");
const response_js_1 = require("../../common/utils/response.js");
class AccountingController {
    static async getAccounts(req, res, next) {
        try {
            const accounts = await accounting_service_js_1.AccountingService.getAccounts();
            return (0, response_js_1.sendResponse)(res, 200, { success: true, data: accounts });
        }
        catch (error) {
            next(error);
        }
    }
    static async createAccount(req, res, next) {
        try {
            const account = await accounting_service_js_1.AccountingService.createAccount(req.body);
            return (0, response_js_1.sendResponse)(res, 201, {
                success: true,
                message: 'Account created in Chart of Accounts',
                data: account,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async recordExpense(req, res, next) {
        try {
            const expense = await accounting_service_js_1.AccountingService.recordExpense(req.body);
            return (0, response_js_1.sendResponse)(res, 201, {
                success: true,
                message: 'Expense entry recorded in Ledger',
                data: expense,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getExpenses(req, res, next) {
        try {
            const result = await accounting_service_js_1.AccountingService.getExpenses(req.query);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: result.expenses,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getFinancialSummary(req, res, next) {
        try {
            const summary = await accounting_service_js_1.AccountingService.getFinancialSummary();
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: summary,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AccountingController = AccountingController;
