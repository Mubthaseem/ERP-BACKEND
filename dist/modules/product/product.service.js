"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_model_js_1 = require("./product.model.js");
const ApiError_js_1 = require("../../common/errors/ApiError.js");
const pagination_js_1 = require("../../common/utils/pagination.js");
const index_js_1 = require("../../common/constants/index.js");
class ProductService {
    static async createProduct(data) {
        const existing = await product_model_js_1.Product.findOne({ sku: data.sku?.toUpperCase() });
        if (existing) {
            throw ApiError_js_1.ApiError.conflict(`Product with SKU ${data.sku} already exists`);
        }
        // Determine status from initial stock
        let status = index_js_1.STOCK_STATUSES.IN_STOCK;
        const stock = data.currentStock || 0;
        const reorder = data.reorderLevel || 5;
        if (stock === 0) {
            status = index_js_1.STOCK_STATUSES.OUT_OF_STOCK;
        }
        else if (stock <= reorder) {
            status = index_js_1.STOCK_STATUSES.LOW_STOCK;
        }
        const product = await product_model_js_1.Product.create({
            ...data,
            sku: data.sku?.toUpperCase(),
            status,
        });
        return product;
    }
    static async getProducts(query) {
        const { page, limit, skip } = (0, pagination_js_1.getPagination)(query);
        const filter = {};
        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { nameArabic: { $regex: query.search, $options: 'i' } },
                { sku: { $regex: query.search, $options: 'i' } },
                { brand: { $regex: query.search, $options: 'i' } },
            ];
        }
        if (query.category)
            filter.category = query.category;
        if (query.status)
            filter.status = query.status;
        if (query.barcode)
            filter.barcodes = query.barcode;
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            filter.retailPrice = {};
            if (query.minPrice !== undefined)
                filter.retailPrice.$gte = Number(query.minPrice);
            if (query.maxPrice !== undefined)
                filter.retailPrice.$lte = Number(query.maxPrice);
        }
        const [products, total] = await Promise.all([
            product_model_js_1.Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            product_model_js_1.Product.countDocuments(filter),
        ]);
        return {
            products,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getProductById(id) {
        const product = await product_model_js_1.Product.findById(id);
        if (!product)
            throw ApiError_js_1.ApiError.notFound('Product not found in ERP');
        return product;
    }
    static async getProductByBarcode(barcode) {
        const product = await product_model_js_1.Product.findOne({ barcodes: barcode });
        if (!product)
            throw ApiError_js_1.ApiError.notFound(`No product found with barcode: ${barcode}`);
        return product;
    }
    static async updateProduct(id, data) {
        // Recalculate stock status if stock or reorder level changed
        if (data.currentStock !== undefined || data.reorderLevel !== undefined) {
            const existing = await product_model_js_1.Product.findById(id);
            if (existing) {
                const stock = data.currentStock !== undefined ? data.currentStock : existing.currentStock;
                const reorder = data.reorderLevel !== undefined ? data.reorderLevel : existing.reorderLevel;
                if (stock === 0) {
                    data.status = index_js_1.STOCK_STATUSES.OUT_OF_STOCK;
                }
                else if (stock <= reorder) {
                    data.status = index_js_1.STOCK_STATUSES.LOW_STOCK;
                }
                else {
                    data.status = index_js_1.STOCK_STATUSES.IN_STOCK;
                }
            }
        }
        const product = await product_model_js_1.Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!product)
            throw ApiError_js_1.ApiError.notFound('Product not found');
        return product;
    }
    static async deleteProduct(id) {
        const product = await product_model_js_1.Product.findByIdAndDelete(id);
        if (!product)
            throw ApiError_js_1.ApiError.notFound('Product not found');
        return { message: 'Product deleted from ERP catalog' };
    }
}
exports.ProductService = ProductService;
