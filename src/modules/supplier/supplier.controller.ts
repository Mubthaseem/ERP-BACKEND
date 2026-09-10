import { Request, Response, NextFunction } from 'express';
import { SupplierService } from './supplier.service.js';
import { sendResponse } from '../../common/utils/response.js';

export class SupplierController {
  static async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await SupplierService.createSupplier(req.body);
      return sendResponse(res, 201, {
        success: true,
        message: 'Supplier registered into Master Data',
        data: supplier,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SupplierService.getSuppliers(req.query);
      return sendResponse(res, 200, {
        success: true,
        data: result.suppliers,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const supplier = await SupplierService.getSupplierById(id);
      return sendResponse(res, 200, { success: true, data: supplier });
    } catch (error) {
      next(error);
    }
  }

  static async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const supplier = await SupplierService.updateSupplier(id, req.body);
      return sendResponse(res, 200, {
        success: true,
        message: 'Supplier updated successfully',
        data: supplier,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await SupplierService.deleteSupplier(id);
      return sendResponse(res, 200, { success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }
}
