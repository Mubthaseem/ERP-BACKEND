import { Supplier, ISupplier } from './supplier.model.js';
import { ApiError } from '../../common/errors/ApiError.js';
import { getPagination, IPaginationOptions } from '../../common/utils/pagination.js';

export class SupplierService {
  static async createSupplier(data: Partial<ISupplier>) {
    const existing = await Supplier.findOne({ code: data.code?.toUpperCase() });
    if (existing) throw ApiError.conflict(`Supplier with code ${data.code} already exists`);
    return await Supplier.create({ ...data, code: data.code?.toUpperCase() });
  }

  static async getSuppliers(query: { search?: string } & IPaginationOptions) {
    const { page, limit, skip } = getPagination(query);
    const filter: any = {};
    if (query.search) {
      filter.$or = [
        { nameEn: { $regex: query.search, $options: 'i' } },
        { nameAr: { $regex: query.search, $options: 'i' } },
        { code: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [suppliers, total] = await Promise.all([
      Supplier.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Supplier.countDocuments(filter),
    ]);

    return { suppliers, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async getSupplierById(id: string) {
    const supplier = await Supplier.findById(id);
    if (!supplier) throw ApiError.notFound('Supplier not found');
    return supplier;
  }

  static async updateSupplier(id: string, data: Partial<ISupplier>) {
    const supplier = await Supplier.findByIdAndUpdate(id, data, { new: true });
    if (!supplier) throw ApiError.notFound('Supplier not found');
    return supplier;
  }

  static async deleteSupplier(id: string) {
    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) throw ApiError.notFound('Supplier not found');
    return { message: 'Supplier deleted successfully' };
  }
}
