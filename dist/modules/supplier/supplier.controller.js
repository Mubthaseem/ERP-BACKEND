"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierController = void 0;
const supplier_service_js_1 = require("./supplier.service.js");
const response_js_1 = require("../../common/utils/response.js");
class SupplierController {
    static async createSupplier(req, res, next) {
        try {
            const supplier = await supplier_service_js_1.SupplierService.createSupplier(req.body);
            return (0, response_js_1.sendResponse)(res, 201, {
                success: true,
                message: 'Supplier registered into Master Data',
                data: supplier,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getSuppliers(req, res, next) {
        try {
            const result = await supplier_service_js_1.SupplierService.getSuppliers(req.query);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: result.suppliers,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getSupplierById(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const supplier = await supplier_service_js_1.SupplierService.getSupplierById(id);
            return (0, response_js_1.sendResponse)(res, 200, { success: true, data: supplier });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateSupplier(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const supplier = await supplier_service_js_1.SupplierService.updateSupplier(id, req.body);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                message: 'Supplier updated successfully',
                data: supplier,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteSupplier(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await supplier_service_js_1.SupplierService.deleteSupplier(id);
            return (0, response_js_1.sendResponse)(res, 200, { success: true, message: result.message });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SupplierController = SupplierController;
