"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleController = void 0;
const sale_service_js_1 = require("./sale.service.js");
const response_js_1 = require("../../common/utils/response.js");
class SaleController {
    static async createSaleInvoice(req, res, next) {
        try {
            const sale = await sale_service_js_1.SaleService.createSaleInvoice(req.body);
            return (0, response_js_1.sendResponse)(res, 201, {
                success: true,
                message: 'Sale Invoice generated and ZATCA QR code created',
                data: sale,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getSales(req, res, next) {
        try {
            const result = await sale_service_js_1.SaleService.getSales(req.query);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: result.sales,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getSaleById(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const sale = await sale_service_js_1.SaleService.getSaleById(id);
            return (0, response_js_1.sendResponse)(res, 200, { success: true, data: sale });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SaleController = SaleController;
