"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseController = void 0;
const purchase_service_js_1 = require("./purchase.service.js");
const response_js_1 = require("../../common/utils/response.js");
class PurchaseController {
    static async createPurchaseOrder(req, res, next) {
        try {
            const purchase = await purchase_service_js_1.PurchaseService.createPurchaseOrder(req.body);
            return (0, response_js_1.sendResponse)(res, 201, {
                success: true,
                message: 'Purchase Order generated successfully',
                data: purchase,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async receiveGoods(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const purchase = await purchase_service_js_1.PurchaseService.receiveGoods(id);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                message: 'Goods received and stock inventory updated in MongoDB',
                data: purchase,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getPurchases(req, res, next) {
        try {
            const result = await purchase_service_js_1.PurchaseService.getPurchases(req.query);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: result.purchases,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getPurchaseById(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const purchase = await purchase_service_js_1.PurchaseService.getPurchaseById(id);
            return (0, response_js_1.sendResponse)(res, 200, { success: true, data: purchase });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PurchaseController = PurchaseController;
