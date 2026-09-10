import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service.js';
import { sendResponse } from '../../common/utils/response.js';

export class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body);
      return sendResponse(res, 201, {
        success: true,
        message: 'Product added to master data successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getProducts(req.query);
      return sendResponse(res, 200, {
        success: true,
        data: result.products,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const product = await ProductService.getProductById(id);
      return sendResponse(res, 200, {
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductByBarcode(req: Request, res: Response, next: NextFunction) {
    try {
      const barcode = Array.isArray(req.params.barcode) ? req.params.barcode[0] : req.params.barcode;
      const product = await ProductService.getProductByBarcode(barcode);
      return sendResponse(res, 200, {
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const product = await ProductService.updateProduct(id, req.body);
      return sendResponse(res, 200, {
        success: true,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await ProductService.deleteProduct(id);
      return sendResponse(res, 200, {
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
