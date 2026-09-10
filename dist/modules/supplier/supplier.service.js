"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierService = void 0;
const supplier_model_js_1 = require("./supplier.model.js");
const ApiError_js_1 = require("../../common/errors/ApiError.js");
const pagination_js_1 = require("../../common/utils/pagination.js");
class SupplierService {
    static async createSupplier(data) {
        const existing = await supplier_model_js_1.Supplier.findOne({ code: data.code?.toUpperCase() });
        if (existing)
            throw ApiError_js_1.ApiError.conflict(`Supplier with code ${data.code} already exists`);
        return await supplier_model_js_1.Supplier.create({ ...data, code: data.code?.toUpperCase() });
    }
    static async getSuppliers(query) {
        const { page, limit, skip } = (0, pagination_js_1.getPagination)(query);
        const filter = {};
        if (query.search) {
            filter.$or = [
                { nameEn: { $regex: query.search, $options: 'i' } },
                { nameAr: { $regex: query.search, $options: 'i' } },
                { code: { $regex: query.search, $options: 'i' } },
                { phone: { $regex: query.search, $options: 'i' } },
            ];
        }
        const [suppliers, total] = await Promise.all([
            supplier_model_js_1.Supplier.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            supplier_model_js_1.Supplier.countDocuments(filter),
        ]);
        return { suppliers, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    static async getSupplierById(id) {
        const supplier = await supplier_model_js_1.Supplier.findById(id);
        if (!supplier)
            throw ApiError_js_1.ApiError.notFound('Supplier not found');
        return supplier;
    }
    static async updateSupplier(id, data) {
        const supplier = await supplier_model_js_1.Supplier.findByIdAndUpdate(id, data, { new: true });
        if (!supplier)
            throw ApiError_js_1.ApiError.notFound('Supplier not found');
        return supplier;
    }
    static async deleteSupplier(id) {
        const supplier = await supplier_model_js_1.Supplier.findByIdAndDelete(id);
        if (!supplier)
            throw ApiError_js_1.ApiError.notFound('Supplier not found');
        return { message: 'Supplier deleted successfully' };
    }
}
exports.SupplierService = SupplierService;
