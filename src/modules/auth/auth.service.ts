import { User } from '../user/user.model.js';
import { comparePassword, hashPassword } from '../../common/utils/hash.js';
import { generateToken } from '../../common/utils/jwt.js';
import { ApiError } from '../../common/errors/ApiError.js';
import { AUTH_MESSAGES } from './auth.constants.js';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw ApiError.forbidden(AUTH_MESSAGES.ACCOUNT_INACTIVE);
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      branchId: user.branchId,
      warehouseId: user.warehouseId,
    });

    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    return {
      token,
      user: userObj,
    };
  }

  static async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  static async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) throw ApiError.notFound('User not found');

    const isMatch = await comparePassword(currentPass, user.passwordHash);
    if (!isMatch) {
      throw ApiError.badRequest('Current password provided is incorrect');
    }

    user.passwordHash = await hashPassword(newPass);
    await user.save();

    return { message: AUTH_MESSAGES.PASSWORD_CHANGED };
  }
}
