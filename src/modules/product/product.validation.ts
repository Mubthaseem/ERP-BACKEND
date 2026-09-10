import { z } from 'zod';
import { TAX_CATEGORIES, ITEM_STATUSES } from '../../common/constants/index.js';

export const createProductSchema = z.object({
  body: z.object({
    sku: z.string().min(1, 'SKU is required'),
    name: z.string().min(2, 'English name is required'),
    nameArabic: z.string().optional(),
    category: z.string().default('General'),
    subcategory: z.string().optional(),
    brand: z.string().optional(),
    barcodes: z.array(z.string()).optional().default([]),
    unit: z.string().optional().default('PCS'),
    costPrice: z.number().nonnegative().optional().default(0),
    retailPrice: z.number().nonnegative('Retail price must be non-negative'),
    wholesalePrice: z.number().nonnegative().optional().default(0),
    vatCategory: z.nativeEnum(TAX_CATEGORIES).optional().default(TAX_CATEGORIES.STANDARD_15),
    vatRate: z.number().optional().default(15),
    currentStock: z.number().nonnegative().optional().default(0),
    reorderLevel: z.number().nonnegative().optional().default(5),
    warehouseId: z.string().optional(),
    shopId: z.string().optional(),
    itemStatus: z.nativeEnum(ITEM_STATUSES).optional().default(ITEM_STATUSES.ACTIVE),
    description: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
  body: z.object({
    sku: z.string().optional(),
    name: z.string().optional(),
    nameArabic: z.string().optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    brand: z.string().optional(),
    barcodes: z.array(z.string()).optional(),
    unit: z.string().optional(),
    costPrice: z.number().nonnegative().optional(),
    retailPrice: z.number().nonnegative().optional(),
    wholesalePrice: z.number().nonnegative().optional(),
    vatCategory: z.nativeEnum(TAX_CATEGORIES).optional(),
    vatRate: z.number().optional(),
    currentStock: z.number().nonnegative().optional(),
    reorderLevel: z.number().nonnegative().optional(),
    warehouseId: z.string().optional(),
    shopId: z.string().optional(),
    itemStatus: z.nativeEnum(ITEM_STATUSES).optional(),
    description: z.string().optional(),
  }),
});
