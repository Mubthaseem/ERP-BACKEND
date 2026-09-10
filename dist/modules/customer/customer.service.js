"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const customer_model_js_1 = require("./customer.model.js");
const ApiError_js_1 = require("../../common/errors/ApiError.js");
const pagination_js_1 = require("../../common/utils/pagination.js");
class CustomerService {
    static async createCustomer(data) {
        const existing = await customer_model_js_1.Customer.findOne({ code: data.code?.toUpperCase() });
        if (existing)
            throw ApiError_js_1.ApiError.conflict(`Customer with code ${data.code} already exists`);
        return await customer_model_js_1.Customer.create({ ...data, code: data.code?.toUpperCase() });
    }
    static async getCustomers(query) {
        const { page, limit, skip } = (0, pagination_js_1.getPagination)(query);
        const filter = {};
        if (query.search) {
            filter.$or = [
                { nameEn: { $regex: query.search, $options: 'i' } },
                { nameAr: { $regex: query.search, $options: 'i' } },
                { code: { $regex: query.search, $options: 'i' } },
                { phone: { $regex: query.search, $options: 'i' } },
                { vatNumber: { $regex: query.search, $options: 'i' } },
            ];
        }
        if (query.type)
            filter.customerType = query.type;
        const [customers, total] = await Promise.all([
            customer_model_js_1.Customer.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            customer_model_js_1.Customer.countDocuments(filter),
        ]);
        return { customers, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    static async getCustomerById(id) {
        const customer = await customer_model_js_1.Customer.findById(id);
        if (!customer)
            throw ApiError_js_1.ApiError.notFound('Customer not found');
        return customer;
    }
    static async updateCustomer(id, data) {
        const customer = await customer_model_js_1.Customer.findByIdAndUpdate(id, data, { new: true });
        if (!customer)
            throw ApiError_js_1.ApiError.notFound('Customer not found');
        return customer;
    }
    static async deleteCustomer(id) {
        const customer = await customer_model_js_1.Customer.findByIdAndDelete(id);
        if (!customer)
            throw ApiError_js_1.ApiError.notFound('Customer not found');
        return { message: 'Customer deleted successfully' };
    }
}
exports.CustomerService = CustomerService;
