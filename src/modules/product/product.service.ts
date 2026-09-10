import { Product, IProduct } from './product.model.js';
import { ApiError } from '../../common/errors/ApiError.js';
import { getPagination, IPaginationOptions } from '../../common/utils/pagination.js';
import { STOCK_STATUSES } from '../../common/constants/index.js';

export class ProductService {
  static async createProduct(data: Partial<IProduct>) {
    const existing = await Product.findOne({ sku: data.sku?.toUpperCase() });
    if (existing) {
      throw ApiError.conflict(`Product with SKU ${data.sku} already exists`);
    }

    // Determine status from initial stock
    let status: string = STOCK_STATUSES.IN_STOCK;
    const stock = data.currentStock || 0;
    const reorder = data.reorderLevel || 5;

    if (stock === 0) {
      status = STOCK_STATUSES.OUT_OF_STOCK;
    } else if (stock <= reorder) {
      status = STOCK_STATUSES.LOW_STOCK;
    }

    const product = await Product.create({
      ...data,
      sku: data.sku?.toUpperCase(),
      status,
    });

    return product;
  }

  static async getProducts(
    query: {
      search?: string;
      category?: string;
      status?: string;
      barcode?: string;
      minPrice?: number;
      maxPrice?: number;
    } & IPaginationOptions
  ) {
    const { page, limit, skip } = getPagination(query);
    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { nameArabic: { $regex: query.search, $options: 'i' } },
        { sku: { $regex: query.search, $options: 'i' } },
        { brand: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    if (query.barcode) filter.barcodes = query.barcode;

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.retailPrice = {};
      if (query.minPrice !== undefined) filter.retailPrice.$gte = Number(query.minPrice);
      if (query.maxPrice !== undefined) filter.retailPrice.$lte = Number(query.maxPrice);
    }

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
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

  static async getProductById(id: string) {
    const product = await Product.findById(id);
    if (!product) throw ApiError.notFound('Product not found in ERP');
    return product;
  }

  static async getProductByBarcode(barcode: string) {
    const product = await Product.findOne({ barcodes: barcode });
    if (!product) throw ApiError.notFound(`No product found with barcode: ${barcode}`);
    return product;
  }

  static async updateProduct(id: string, data: Partial<IProduct>) {
    // Recalculate stock status if stock or reorder level changed
    if (data.currentStock !== undefined || data.reorderLevel !== undefined) {
      const existing = await Product.findById(id);
      if (existing) {
        const stock = data.currentStock !== undefined ? data.currentStock : existing.currentStock;
        const reorder = data.reorderLevel !== undefined ? data.reorderLevel : existing.reorderLevel;

        if (stock === 0) {
          data.status = STOCK_STATUSES.OUT_OF_STOCK;
        } else if (stock <= reorder) {
          data.status = STOCK_STATUSES.LOW_STOCK;
        } else {
          data.status = STOCK_STATUSES.IN_STOCK;
        }
      }
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!product) throw ApiError.notFound('Product not found');
    return product;
  }

  static async deleteProduct(id: string) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw ApiError.notFound('Product not found');
    return { message: 'Product deleted from ERP catalog' };
  }
}
