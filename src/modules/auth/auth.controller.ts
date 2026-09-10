import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { sendResponse } from '../../common/utils/response.js';
import { AUTH_MESSAGES } from './auth.constants.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return sendResponse(res, 200, {
        success: true,
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse(res, 401, { success: false, message: 'Unauthorized' });
      }
      const user = await AuthService.getMe(userId);
      return sendResponse(res, 200, {
        success: true,
        message: AUTH_MESSAGES.PROFILE_RETRIEVED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(userId, currentPassword, newPassword);
      return sendResponse(res, 200, {
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
