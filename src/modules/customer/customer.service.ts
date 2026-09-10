import { Customer, ICustomer } from './customer.model.js';
import { ApiError } from '../../common/errors/ApiError.js';
import { getPagination, IPaginationOptions } from '../../common/utils/pagination.js';

export class CustomerService {
  static async createCustomer(data: Partial<ICustomer>) {
    const existing = await Customer.findOne({ code: data.code?.toUpperCase() });
    if (existing) throw ApiError.conflict(`Customer with code ${data.code} already exists`);
    return await Customer.create({ ...data, code: data.code?.toUpperCase() });
  }

  static async getCustomers(query: { search?: string; type?: string } & IPaginationOptions) {
    const { page, limit, skip } = getPagination(query);
    const filter: any = {};
    if (query.search) {
      filter.$or = [
        { nameEn: { $regex: query.search, $options: 'i' } },
        { nameAr: { $regex: query.search, $options: 'i' } },
        { code: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
        { vatNumber: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.type) filter.customerType = query.type;

    const [customers, total] = await Promise.all([
      Customer.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Customer.countDocuments(filter),
    ]);

    return { customers, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async getCustomerById(id: string) {
    const customer = await Customer.findById(id);
    if (!customer) throw ApiError.notFound('Customer not found');
    return customer;
  }

  static async updateCustomer(id: string, data: Partial<ICustomer>) {
    const customer = await Customer.findByIdAndUpdate(id, data, { new: true });
    if (!customer) throw ApiError.notFound('Customer not found');
    return customer;
  }

  static async deleteCustomer(id: string) {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) throw ApiError.notFound('Customer not found');
    return { message: 'Customer deleted successfully' };
  }
}
