import { Request, Response, NextFunction } from 'express';
import { AccountingService } from './accounting.service.js';
import { sendResponse } from '../../common/utils/response.js';

export class AccountingController {
  static async getAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const accounts = await AccountingService.getAccounts();
      return sendResponse(res, 200, { success: true, data: accounts });
    } catch (error) {
      next(error);
    }
  }

  static async createAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await AccountingService.createAccount(req.body);
      return sendResponse(res, 201, {
        success: true,
        message: 'Account created in Chart of Accounts',
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  static async recordExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await AccountingService.recordExpense(req.body);
      return sendResponse(res, 201, {
        success: true,
        message: 'Expense entry recorded in Ledger',
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AccountingService.getExpenses(req.query);
      return sendResponse(res, 200, {
        success: true,
        data: result.expenses,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFinancialSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await AccountingService.getFinancialSummary();
      return sendResponse(res, 200, {
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}
