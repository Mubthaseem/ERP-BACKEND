import { z } from 'zod';
import { SYSTEM_ROLES } from '../../common/constants/index.js';

export const createUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    fullNameArabic: z.string().optional(),
    email: z.string().email('Invalid email address format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.nativeEnum(SYSTEM_ROLES).optional().default(SYSTEM_ROLES.SALES_POS_USER),
    phone: z.string().optional(),
    companyId: z.string().optional(),
    branchId: z.string().optional(),
    warehouseId: z.string().optional(),
    languagePreference: z.enum(['en', 'ar']).optional().default('en'),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    fullName: z.string().min(2).optional(),
    fullNameArabic: z.string().optional(),
    role: z.nativeEnum(SYSTEM_ROLES).optional(),
    phone: z.string().optional(),
    branchId: z.string().optional(),
    warehouseId: z.string().optional(),
    isActive: z.boolean().optional(),
    languagePreference: z.enum(['en', 'ar']).optional(),
  }),
});
