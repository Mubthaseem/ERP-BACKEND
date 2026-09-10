"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const customer_service_js_1 = require("./customer.service.js");
const response_js_1 = require("../../common/utils/response.js");
class CustomerController {
    static async createCustomer(req, res, next) {
        try {
            const customer = await customer_service_js_1.CustomerService.createCustomer(req.body);
            return (0, response_js_1.sendResponse)(res, 201, {
                success: true,
                message: 'Customer profile saved to MongoDB',
                data: customer,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCustomers(req, res, next) {
        try {
            const result = await customer_service_js_1.CustomerService.getCustomers(req.query);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: result.customers,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCustomerById(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const customer = await customer_service_js_1.CustomerService.getCustomerById(id);
            return (0, response_js_1.sendResponse)(res, 200, { success: true, data: customer });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCustomer(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const customer = await customer_service_js_1.CustomerService.updateCustomer(id, req.body);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                message: 'Customer updated successfully',
                data: customer,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteCustomer(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await customer_service_js_1.CustomerService.deleteCustomer(id);
            return (0, response_js_1.sendResponse)(res, 200, { success: true, message: result.message });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CustomerController = CustomerController;
