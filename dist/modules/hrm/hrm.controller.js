"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrmController = void 0;
const hrm_service_js_1 = require("./hrm.service.js");
const response_js_1 = require("../../common/utils/response.js");
class HrmController {
    static async createEmployee(req, res, next) {
        try {
            const employee = await hrm_service_js_1.HrmService.createEmployee(req.body);
            return (0, response_js_1.sendResponse)(res, 201, {
                success: true,
                message: 'Employee added to HR records',
                data: employee,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getEmployees(req, res, next) {
        try {
            const result = await hrm_service_js_1.HrmService.getEmployees(req.query);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: result.employees,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getEmployeeById(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const employee = await hrm_service_js_1.HrmService.getEmployeeById(id);
            return (0, response_js_1.sendResponse)(res, 200, { success: true, data: employee });
        }
        catch (error) {
            next(error);
        }
    }
    // Payroll Endpoints
    static async calculatePayroll(req, res, next) {
        try {
            const salaryMonth = req.body.salaryMonth || new Date().toISOString().slice(0, 7);
            const payroll = await hrm_service_js_1.HrmService.calculateMonthlyPayroll(salaryMonth);
            return (0, response_js_1.sendResponse)(res, 201, {
                success: true,
                message: 'Monthly payroll run completed successfully',
                data: payroll,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getPayrolls(req, res, next) {
        try {
            const payrolls = await hrm_service_js_1.HrmService.getPayrolls();
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: payrolls,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getPayrollById(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const payroll = await hrm_service_js_1.HrmService.getPayrollById(id);
            return (0, response_js_1.sendResponse)(res, 200, {
                success: true,
                data: payroll,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Download WPS SIF file
    static async downloadWpsSif(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const { filename, content } = await hrm_service_js_1.HrmService.generateWpsSifContent(id);
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            return res.status(200).send(content);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.HrmController = HrmController;
