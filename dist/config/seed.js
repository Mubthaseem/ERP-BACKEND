"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabaseIfEmpty = void 0;
const user_model_js_1 = require("../modules/user/user.model.js");
const product_model_js_1 = require("../modules/product/product.model.js");
const customer_model_js_1 = require("../modules/customer/customer.model.js");
const supplier_model_js_1 = require("../modules/supplier/supplier.model.js");
const accounting_model_js_1 = require("../modules/accounting/accounting.model.js");
const organization_model_js_1 = require("../modules/organization/organization.model.js");
const hrm_model_js_1 = require("../modules/hrm/hrm.model.js");
const sale_model_js_1 = require("../modules/sale/sale.model.js");
const hash_js_1 = require("../common/utils/hash.js");
const index_js_1 = require("../common/constants/index.js");
const zatca_js_1 = require("../modules/sale/zatca.js");
const logger_js_1 = require("./logger.js");
const seedDatabaseIfEmpty = async () => {
    try {
        const userCount = await user_model_js_1.User.countDocuments();
        if (userCount > 0) {
            logger_js_1.logger.info('Database already contains records. Skipping seed.');
            return;
        }
        logger_js_1.logger.info('🌱 Seeding Saudi Arabia ERP Master Data into MongoDB...');
        // 1. Super Admin User
        const adminPasswordHash = await (0, hash_js_1.hashPassword)('Admin@123');
        await user_model_js_1.User.create({
            fullName: 'Sultan Al-Otaibi',
            fullNameArabic: 'سلطان العتيبي',
            email: 'admin@erp.sa',
            passwordHash: adminPasswordHash,
            role: index_js_1.SYSTEM_ROLES.SUPER_ADMIN,
            phone: '+966501234567',
            languagePreference: 'en',
        });
        // 2. Organization & Branches
        await organization_model_js_1.Organization.create([
            {
                nameEn: 'Al-Madina Enterprise & Trading Co.',
                nameAr: 'شركة المدينة للمشاريع والتجارة',
                type: 'COMPANY',
                code: 'ORG-001',
                crNumber: '1010897654',
                vatNumber: '310123456700003',
                city: 'Riyadh',
                country: 'Saudi Arabia',
                currency: 'SAR',
            },
            {
                nameEn: 'Riyadh Central Warehouse & Distribution',
                nameAr: 'مستودع الرياض المركزي والتوزيع',
                type: 'WAREHOUSE',
                code: 'WH-RYD-01',
                city: 'Riyadh',
                country: 'Saudi Arabia',
            },
            {
                nameEn: 'Jeddah Waterfront Retail Outlet',
                nameAr: 'فرع مبيعات جدة الواجهة البحرية',
                type: 'SHOP',
                code: 'SHP-JED-01',
                city: 'Jeddah',
                country: 'Saudi Arabia',
            },
        ]);
        // 3. Chart of Accounts
        await accounting_model_js_1.Account.create([
            { code: '1010', nameEn: 'Cash on Hand / POS Till', nameAr: 'النقدية في الصندوق', type: 'ASSET', balance: 45000 },
            { code: '1020', nameEn: 'Al-Rajhi Bank Corporate SAR', nameAr: 'مصرف الراجحي الحساب الجاري', type: 'ASSET', balance: 485000 },
            { code: '1200', nameEn: 'Accounts Receivable (Debtors)', nameAr: 'العملاء والمدينون', type: 'ASSET', balance: 82500 },
            { code: '1300', nameEn: 'Inventory Asset Account', nameAr: 'حساب مخزون البضائع', type: 'ASSET', balance: 340000 },
            { code: '2010', nameEn: 'Accounts Payable (Creditors)', nameAr: 'الموردون والدائنون', type: 'LIABILITY', balance: 94000 },
            { code: '2050', nameEn: 'ZATCA Output VAT Payable (15%)', nameAr: 'ضريبة القيمة المضافة المستحقة لهيئة الزكاة', type: 'LIABILITY', balance: 36200 },
            { code: '4010', nameEn: 'Wholesale & Retail Sales Revenue', nameAr: 'إيرادات المبيعات العامة', type: 'REVENUE', balance: 890000 },
            { code: '5010', nameEn: 'Cost of Goods Sold (COGS)', nameAr: 'تكلفة البضاعة المباعة', type: 'EXPENSE', balance: 520000 },
            { code: '6010', nameEn: 'Salaries & GOSI Expense', nameAr: 'الرواتب والتأمينات الاجتماعية', type: 'EXPENSE', balance: 85000 },
            { code: '6020', nameEn: 'Shop & Warehouse Rent', nameAr: 'إيجارات المعارض والمستودعات', type: 'EXPENSE', balance: 45000 },
        ]);
        // 4. Products & Master Data
        const products = await product_model_js_1.Product.create([
            {
                sku: 'KSA-DAT-001',
                name: 'Royal Ajwa Dates Premium Box 1kg',
                nameArabic: 'تمر عجوة ملكي فاخر ١ كجم',
                category: 'Food & Gourmet',
                brand: 'Al-Madina Dates',
                barcodes: ['628100100101'],
                unit: 'BOX',
                costPrice: 45.0,
                wholesalePrice: 65.0,
                retailPrice: 85.0,
                vatCategory: 'STANDARD_15',
                vatRate: 15,
                currentStock: 350,
                reorderLevel: 25,
                status: 'In Stock',
            },
            {
                sku: 'KSA-COF-002',
                name: 'Saudi Arabic Coffee Cardamom Blend 500g',
                nameArabic: 'قهوة سعودية بالهيل الفاخرة ٥٠٠ جم',
                category: 'Beverages',
                brand: 'Khawlani Blend',
                barcodes: ['628100100102'],
                unit: 'PACK',
                costPrice: 22.5,
                wholesalePrice: 32.0,
                retailPrice: 42.0,
                vatCategory: 'STANDARD_15',
                vatRate: 15,
                currentStock: 180,
                reorderLevel: 20,
                status: 'In Stock',
            },
            {
                sku: 'KSA-OUD-003',
                name: 'Cambodian Agarwood Dehn Oud 12ml',
                nameArabic: 'دهن عود كمبودي معتق ١٢ مل',
                category: 'Perfumes & Oud',
                brand: 'Al-Qurashi Heritage',
                barcodes: ['628100100103'],
                unit: 'BOTTLE',
                costPrice: 280.0,
                wholesalePrice: 420.0,
                retailPrice: 550.0,
                vatCategory: 'STANDARD_15',
                vatRate: 15,
                currentStock: 45,
                reorderLevel: 10,
                status: 'In Stock',
            },
            {
                sku: 'KSA-STL-004',
                name: 'SABIC Reinforced Steel Rebar 12mm',
                nameArabic: 'حديد تسليح سابك عالي الجودة ١٢ ملم',
                category: 'Construction Materials',
                brand: 'SABIC',
                barcodes: ['628100100104'],
                unit: 'TON',
                costPrice: 2600.0,
                wholesalePrice: 2850.0,
                retailPrice: 3100.0,
                vatCategory: 'STANDARD_15',
                vatRate: 15,
                currentStock: 18,
                reorderLevel: 5,
                status: 'In Stock',
            },
        ]);
        // 5. Customers
        const customer = await customer_model_js_1.Customer.create({
            code: 'CUST-001',
            nameEn: 'Al-Hokair Trading Group',
            nameAr: 'مجموعة الحكير للتجارة',
            customerType: 'WHOLESALE',
            vatNumber: '310987654300003',
            crNumber: '1010456789',
            phone: '+966112345678',
            city: 'Riyadh',
            district: 'Al-Olaya',
            country: 'Saudi Arabia',
            creditLimit: 150000,
            currentBalance: 34500,
        });
        // 6. Suppliers
        await supplier_model_js_1.Supplier.create({
            code: 'SUPP-001',
            nameEn: 'National Dates Packaging Co.',
            nameAr: 'الشركة الوطنية لتعبئة التمور',
            vatNumber: '310456123400003',
            crNumber: '1010654321',
            phone: '+966114567890',
            city: 'Qassim',
            country: 'Saudi Arabia',
            paymentTerms: 'Net 30 Days',
            currentPayable: 42000,
        });
        // 7. Employees
        await hrm_model_js_1.Employee.create([
            {
                employeeCode: 'EMP-001',
                nameEn: 'Mohammed Al-Zahrani',
                nameAr: 'محمد الزهراني',
                nationalIdOrIqama: '1098765432',
                department: 'Finance & Accounts',
                designation: 'Senior Accountant',
                basicSalary: 9500,
                housingAllowance: 2375,
                transportAllowance: 1000,
                otherAllowance: 500,
                totalSalary: 13375,
                gosiDeduction: 1157.81,
                status: 'ACTIVE',
            },
            {
                employeeCode: 'EMP-002',
                nameEn: 'Tariq Al-Ghamdi',
                nameAr: 'طارق الغامدي',
                nationalIdOrIqama: '1087654321',
                department: 'Sales & Operations',
                designation: 'Branch & POS Supervisor',
                basicSalary: 7500,
                housingAllowance: 1875,
                transportAllowance: 800,
                otherAllowance: 400,
                totalSalary: 10575,
                gosiDeduction: 914.06,
                status: 'ACTIVE',
            },
        ]);
        // 8. Sample Real ZATCA Invoice
        const qrCode = (0, zatca_js_1.generateZatcaTlvQrCode)({
            sellerName: 'Al-Madina Enterprise & Trading Co.',
            vatNumber: '310123456700003',
            timestamp: new Date().toISOString(),
            invoiceTotal: '1150.00',
            vatTotal: '150.00',
        });
        await sale_model_js_1.Sale.create({
            invoiceNumber: 'INV-2026-00001',
            invoiceType: 'STANDARD_TAX',
            channel: 'WHOLESALE',
            customerId: customer._id,
            customerName: 'Al-Hokair Trading Group',
            customerVatNumber: '310987654300003',
            items: [
                {
                    productId: products[0]._id.toString(),
                    sku: products[0].sku,
                    name: products[0].name,
                    quantity: 10,
                    unitPrice: 100.0,
                    discount: 0,
                    vatRate: 15,
                    vatAmount: 150.0,
                    subtotal: 1000.0,
                    total: 1150.0,
                },
            ],
            subtotal: 1000.0,
            totalVat: 150.0,
            totalAmount: 1150.0,
            paymentMethod: 'CREDIT_ACCOUNT',
            paidAmount: 1150.0,
            changeAmount: 0,
            zatcaQrCode: qrCode,
            zatcaStatus: 'REPORTED',
            status: 'COMPLETED',
        });
        logger_js_1.logger.info('✅ Real Master Data seeded successfully into MongoDB!');
    }
    catch (error) {
        logger_js_1.logger.error(`Error during database seed: ${error.message}`);
    }
};
exports.seedDatabaseIfEmpty = seedDatabaseIfEmpty;
