"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOCK_STATUSES = exports.ITEM_STATUSES = exports.TAX_CATEGORIES = exports.SYSTEM_ROLES = void 0;
exports.SYSTEM_ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    COMPANY_ADMIN: 'COMPANY_ADMIN',
    BRANCH_MANAGER: 'BRANCH_MANAGER',
    SHOP_MANAGER: 'SHOP_MANAGER',
    WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
    PURCHASING_OFFICER: 'PURCHASING_OFFICER',
    SALES_POS_USER: 'SALES_POS_USER',
    ACCOUNTANT: 'ACCOUNTANT',
    HR_PAYROLL_OFFICER: 'HR_PAYROLL_OFFICER',
    AUDITOR_READONLY: 'AUDITOR_READONLY',
};
exports.TAX_CATEGORIES = {
    STANDARD_15: 'STANDARD_15', // 15% Standard Saudi VAT
    ZERO_RATED: 'ZERO_RATED', // 0% (Exports, International transport)
    EXEMPT: 'EXEMPT', // Exempt (Financial services, residential rent)
    OUT_OF_SCOPE: 'OUT_OF_SCOPE',
};
exports.ITEM_STATUSES = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    DISCONTINUED: 'DISCONTINUED',
};
exports.STOCK_STATUSES = {
    IN_STOCK: 'In Stock',
    LOW_STOCK: 'Low Stock',
    OUT_OF_STOCK: 'Out of Stock',
};
