"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_controller_js_1 = require("../modules/auth/auth.controller.js");
const user_controller_js_1 = require("../modules/user/user.controller.js");
const product_controller_js_1 = require("../modules/product/product.controller.js");
const customer_controller_js_1 = require("../modules/customer/customer.controller.js");
const supplier_controller_js_1 = require("../modules/supplier/supplier.controller.js");
const purchase_controller_js_1 = require("../modules/purchase/purchase.controller.js");
const sale_controller_js_1 = require("../modules/sale/sale.controller.js");
const accounting_controller_js_1 = require("../modules/accounting/accounting.controller.js");
const hrm_controller_js_1 = require("../modules/hrm/hrm.controller.js");
const auth_middleware_js_1 = require("../common/middlewares/auth.middleware.js");
const validate_middleware_js_1 = require("../common/middlewares/validate.middleware.js");
const auth_validation_js_1 = require("../modules/auth/auth.validation.js");
const user_validation_js_1 = require("../modules/user/user.validation.js");
const product_validation_js_1 = require("../modules/product/product.validation.js");
const response_js_1 = require("../common/utils/response.js");
const router = (0, express_1.Router)();
// 1. SYSTEM HEALTH & METRICS
router.get('/health', (req, res) => {
    const dbState = mongoose_1.default.connection.readyState;
    const states = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting',
    };
    return (0, response_js_1.sendResponse)(res, 200, {
        success: true,
        message: 'Saudi Arabia ERP Real-Time API Gateway Operational',
        data: {
            status: 'ONLINE',
            database: {
                driver: 'MongoDB / Mongoose (Live Engine)',
                status: states[dbState] || 'Unknown',
                connected: dbState === 1,
            },
            currency: 'SAR',
            vatStandardRate: '15%',
            zatcaEInvoicing: 'Compliant (TLV Base64 QR Enabled)',
            timestamp: new Date().toISOString(),
        },
    });
});
// 2. AUTH ROUTES
const authRouter = (0, express_1.Router)();
authRouter.post('/login', (0, validate_middleware_js_1.validate)(auth_validation_js_1.loginSchema), auth_controller_js_1.AuthController.login);
authRouter.get('/me', auth_middleware_js_1.authenticate, auth_controller_js_1.AuthController.getMe);
authRouter.post('/change-password', auth_middleware_js_1.authenticate, (0, validate_middleware_js_1.validate)(auth_validation_js_1.changePasswordSchema), auth_controller_js_1.AuthController.changePassword);
router.use('/auth', authRouter);
// 3. USER & EMPLOYEE ACCESS
const userRouter = (0, express_1.Router)();
userRouter.get('/', user_controller_js_1.UserController.getUsers);
userRouter.post('/', (0, validate_middleware_js_1.validate)(user_validation_js_1.createUserSchema), user_controller_js_1.UserController.createUser);
userRouter.get('/:id', user_controller_js_1.UserController.getUserById);
userRouter.put('/:id', (0, validate_middleware_js_1.validate)(user_validation_js_1.updateUserSchema), user_controller_js_1.UserController.updateUser);
userRouter.delete('/:id', user_controller_js_1.UserController.deleteUser);
router.use('/users', userRouter);
// 4. PRODUCT & INVENTORY MASTER DATA
const productRouter = (0, express_1.Router)();
productRouter.get('/', product_controller_js_1.ProductController.getProducts);
productRouter.get('/barcode/:barcode', product_controller_js_1.ProductController.getProductByBarcode);
productRouter.get('/:id', product_controller_js_1.ProductController.getProductById);
productRouter.post('/', (0, validate_middleware_js_1.validate)(product_validation_js_1.createProductSchema), product_controller_js_1.ProductController.createProduct);
productRouter.put('/:id', (0, validate_middleware_js_1.validate)(product_validation_js_1.updateProductSchema), product_controller_js_1.ProductController.updateProduct);
productRouter.delete('/:id', product_controller_js_1.ProductController.deleteProduct);
router.use('/products', productRouter);
// 5. CUSTOMER MANAGEMENT
const customerRouter = (0, express_1.Router)();
customerRouter.get('/', customer_controller_js_1.CustomerController.getCustomers);
customerRouter.get('/:id', customer_controller_js_1.CustomerController.getCustomerById);
customerRouter.post('/', customer_controller_js_1.CustomerController.createCustomer);
customerRouter.put('/:id', customer_controller_js_1.CustomerController.updateCustomer);
customerRouter.delete('/:id', customer_controller_js_1.CustomerController.deleteCustomer);
router.use('/customers', customerRouter);
// 6. SUPPLIER & VENDOR MANAGEMENT
const supplierRouter = (0, express_1.Router)();
supplierRouter.get('/', supplier_controller_js_1.SupplierController.getSuppliers);
supplierRouter.get('/:id', supplier_controller_js_1.SupplierController.getSupplierById);
supplierRouter.post('/', supplier_controller_js_1.SupplierController.createSupplier);
supplierRouter.put('/:id', supplier_controller_js_1.SupplierController.updateSupplier);
supplierRouter.delete('/:id', supplier_controller_js_1.SupplierController.deleteSupplier);
router.use('/suppliers', supplierRouter);
// 7. PROCUREMENT & PURCHASES
const purchaseRouter = (0, express_1.Router)();
purchaseRouter.get('/', purchase_controller_js_1.PurchaseController.getPurchases);
purchaseRouter.get('/:id', purchase_controller_js_1.PurchaseController.getPurchaseById);
purchaseRouter.post('/', purchase_controller_js_1.PurchaseController.createPurchaseOrder);
purchaseRouter.post('/:id/receive', purchase_controller_js_1.PurchaseController.receiveGoods);
router.use('/purchases', purchaseRouter);
// 8. SALES, POS & ZATCA E-INVOICING
const saleRouter = (0, express_1.Router)();
saleRouter.get('/', sale_controller_js_1.SaleController.getSales);
saleRouter.get('/:id', sale_controller_js_1.SaleController.getSaleById);
saleRouter.post('/', sale_controller_js_1.SaleController.createSaleInvoice);
router.use('/sales', saleRouter);
// 9. ACCOUNTING, GENERAL LEDGER & EXPENSES
const accountingRouter = (0, express_1.Router)();
accountingRouter.get('/accounts', accounting_controller_js_1.AccountingController.getAccounts);
accountingRouter.post('/accounts', accounting_controller_js_1.AccountingController.createAccount);
accountingRouter.get('/expenses', accounting_controller_js_1.AccountingController.getExpenses);
accountingRouter.post('/expenses', accounting_controller_js_1.AccountingController.recordExpense);
accountingRouter.get('/financial-summary', accounting_controller_js_1.AccountingController.getFinancialSummary);
router.use('/accounting', accountingRouter);
// 10. HRM & SALARY & PAYROLL (WPS)
const hrmRouter = (0, express_1.Router)();
hrmRouter.get('/employees', hrm_controller_js_1.HrmController.getEmployees);
hrmRouter.get('/employees/:id', hrm_controller_js_1.HrmController.getEmployeeById);
hrmRouter.post('/employees', hrm_controller_js_1.HrmController.createEmployee);
hrmRouter.post('/payroll/calculate', hrm_controller_js_1.HrmController.calculatePayroll);
hrmRouter.get('/payroll', hrm_controller_js_1.HrmController.getPayrolls);
hrmRouter.get('/payroll/:id', hrm_controller_js_1.HrmController.getPayrollById);
hrmRouter.get('/payroll/:id/wps', hrm_controller_js_1.HrmController.downloadWpsSif);
router.use('/hrm', hrmRouter);
exports.default = router;
