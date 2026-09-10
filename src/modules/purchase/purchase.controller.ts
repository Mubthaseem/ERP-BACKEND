import { Request, Response, NextFunction } from 'express';
import { PurchaseService } from './purchase.service.js';
import { sendResponse } from '../../common/utils/response.js';

export class PurchaseController {
  static async createPurchaseOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const purchase = await PurchaseService.createPurchaseOrder(req.body);
      return sendResponse(res, 201, {
        success: true,
        message: 'Purchase Order generated successfully',
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }

  static async receiveGoods(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const purchase = await PurchaseService.receiveGoods(id);
      return sendResponse(res, 200, {
        success: true,
        message: 'Goods received and stock inventory updated in MongoDB',
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPurchases(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PurchaseService.getPurchases(req.query);
      return sendResponse(res, 200, {
        success: true,
        data: result.purchases,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPurchaseById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const purchase = await PurchaseService.getPurchaseById(id);
      return sendResponse(res, 200, { success: true, data: purchase });
    } catch (error) {
      next(error);
    }
  }
}
