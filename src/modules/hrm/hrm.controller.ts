import { Request, Response, NextFunction } from 'express';
import { HrmService } from './hrm.service.js';
import { sendResponse } from '../../common/utils/response.js';

export class HrmController {
  static async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await HrmService.createEmployee(req.body);
      return sendResponse(res, 201, {
        success: true,
        message: 'Employee added to HR records',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await HrmService.getEmployees(req.query);
      return sendResponse(res, 200, {
        success: true,
        data: result.employees,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployeeById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const employee = await HrmService.getEmployeeById(id);
      return sendResponse(res, 200, { success: true, data: employee });
    } catch (error) {
      next(error);
    }
  }

  // Payroll Endpoints
  static async calculatePayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const salaryMonth = req.body.salaryMonth || new Date().toISOString().slice(0, 7);
      const payroll = await HrmService.calculateMonthlyPayroll(salaryMonth);
      return sendResponse(res, 201, {
        success: true,
        message: 'Monthly payroll run completed successfully',
        data: payroll,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPayrolls(req: Request, res: Response, next: NextFunction) {
    try {
      const payrolls = await HrmService.getPayrolls();
      return sendResponse(res, 200, {
        success: true,
        data: payrolls,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPayrollById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const payroll = await HrmService.getPayrollById(id);
      return sendResponse(res, 200, {
        success: true,
        data: payroll,
      });
    } catch (error) {
      next(error);
    }
  }

  // Download WPS SIF file
  static async downloadWpsSif(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { filename, content } = await HrmService.generateWpsSifContent(id);

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.status(200).send(content);
    } catch (error) {
      next(error);
    }
  }
}
