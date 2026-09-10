import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service.js';
import { sendResponse } from '../../common/utils/response.js';
import { USER_MESSAGES } from './user.constants.js';

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      return sendResponse(res, 201, {
        success: true,
        message: USER_MESSAGES.CREATED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.getUsers(req.query);
      return sendResponse(res, 200, {
        success: true,
        data: result.users,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await UserService.getUserById(id);
      return sendResponse(res, 200, {
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await UserService.updateUser(id, req.body);
      return sendResponse(res, 200, {
        success: true,
        message: USER_MESSAGES.UPDATED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await UserService.deleteUser(id);
      return sendResponse(res, 200, {
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
