import { Request, Response, NextFunction } from 'express';
import { SaleService } from './sale.service.js';
import { sendResponse } from '../../common/utils/response.js';

export class SaleController {
  static async createSaleInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const sale = await SaleService.createSaleInvoice(req.body);
      return sendResponse(res, 201, {
        success: true,
        message: 'Sale Invoice generated and ZATCA QR code created',
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSales(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SaleService.getSales(req.query);
      return sendResponse(res, 200, {
        success: true,
        data: result.sales,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSaleById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const sale = await SaleService.getSaleById(id);
      return sendResponse(res, 200, { success: true, data: sale });
    } catch (error) {
      next(error);
    }
  }
}
