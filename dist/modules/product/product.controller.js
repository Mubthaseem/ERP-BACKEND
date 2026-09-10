"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_js_1 = require("./product.service.js");
const response_js_1 = require("../../common/utils/response.js");
class ProductController {
    static async createProduct(req, res, next) {
        try {
            const product = await product_service_js_1.ProductService.createProduct(req.body);
            return (0, response_js_1.sendResponse)(res, 201, {
                success: true,
                message: 'Product added to master data successfully',
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getProducts(req, res, next) {
        try {
            const result = await product_service_js_1.ProductService.getProducts(req.query);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: result.products,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getProductById(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const product = await product_service_js_1.ProductService.getProductById(id);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getProductByBarcode(req, res, next) {
        try {
            const barcode = Array.isArray(req.params.barcode) ? req.params.barcode[0] : req.params.barcode;
            const product = await product_service_js_1.ProductService.getProductByBarcode(barcode);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProduct(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const product = await product_service_js_1.ProductService.updateProduct(id, req.body);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                message: 'Product updated successfully',
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteProduct(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await product_service_js_1.ProductService.deleteProduct(id);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
