import { User, IUser } from './user.model.js';
import { hashPassword } from '../../common/utils/hash.js';
import { ApiError } from '../../common/errors/ApiError.js';
import { USER_MESSAGES } from './user.constants.js';
import { getPagination, IPaginationOptions } from '../../common/utils/pagination.js';

export class UserService {
  static async createUser(userData: Partial<IUser> & { password?: string }) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      throw ApiError.conflict(USER_MESSAGES.ALREADY_EXISTS);
    }

    const passwordHash = await hashPassword(userData.password || 'SaudiERP@123');

    const newUser = await User.create({
      ...userData,
      passwordHash,
    });

    const userObj = newUser.toObject();
    delete (userObj as any).passwordHash;
    return userObj;
  }

  static async getUsers(query: { search?: string; role?: string; isActive?: boolean } & IPaginationOptions) {
    const { page, limit, skip } = getPagination(query);
    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { fullName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.role) filter.role = query.role;
    if (query.isActive !== undefined) filter.isActive = query.isActive;

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    return {
      users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getUserById(id: string) {
    const user = await User.findById(id);
    if (!user) throw ApiError.notFound(USER_MESSAGES.NOT_FOUND);
    return user;
  }

  static async updateUser(id: string, updateData: Partial<IUser>) {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!user) throw ApiError.notFound(USER_MESSAGES.NOT_FOUND);
    return user;
  }

  static async deleteUser(id: string) {
    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!user) throw ApiError.notFound(USER_MESSAGES.NOT_FOUND);
    return { message: USER_MESSAGES.DELETED };
  }
}
