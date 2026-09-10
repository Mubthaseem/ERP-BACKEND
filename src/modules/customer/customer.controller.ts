import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './customer.service.js';
import { sendResponse } from '../../common/utils/response.js';

export class CustomerController {
  static async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.createCustomer(req.body);
      return sendResponse(res, 201, {
        success: true,
        message: 'Customer profile saved to MongoDB',
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CustomerService.getCustomers(req.query);
      return sendResponse(res, 200, {
        success: true,
        data: result.customers,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const customer = await CustomerService.getCustomerById(id);
      return sendResponse(res, 200, { success: true, data: customer });
    } catch (error) {
      next(error);
    }
  }

  static async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const customer = await CustomerService.updateCustomer(id, req.body);
      return sendResponse(res, 200, {
        success: true,
        message: 'Customer updated successfully',
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await CustomerService.deleteCustomer(id);
      return sendResponse(res, 200, { success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }
}
