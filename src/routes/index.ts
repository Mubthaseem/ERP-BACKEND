import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AuthController } from '../modules/auth/auth.controller.js';
import { UserController } from '../modules/user/user.controller.js';
import { ProductController } from '../modules/product/product.controller.js';
import { CustomerController } from '../modules/customer/customer.controller.js';
import { SupplierController } from '../modules/supplier/supplier.controller.js';
import { PurchaseController } from '../modules/purchase/purchase.controller.js';
import { SaleController } from '../modules/sale/sale.controller.js';
import { AccountingController } from '../modules/accounting/accounting.controller.js';
import { HrmController } from '../modules/hrm/hrm.controller.js';

import { authenticate, authorizeRoles } from '../common/middlewares/auth.middleware.js';
import { validate } from '../common/middlewares/validate.middleware.js';
import { loginSchema, changePasswordSchema } from '../modules/auth/auth.validation.js';
import { createUserSchema, updateUserSchema } from '../modules/user/user.validation.js';
import { createProductSchema, updateProductSchema } from '../modules/product/product.validation.js';
import { SYSTEM_ROLES } from '../common/constants/index.js';
import { sendResponse } from '../common/utils/response.js';

const router = Router();

// 1. SYSTEM HEALTH & METRICS
router.get('/health', (req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const states: Record<number, string> = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  return sendResponse(res, 200, {
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
const authRouter = Router();
authRouter.post('/login', validate(loginSchema), AuthController.login);
authRouter.get('/me', authenticate, AuthController.getMe);
authRouter.post('/change-password', authenticate, validate(changePasswordSchema), AuthController.changePassword);
router.use('/auth', authRouter);

// 3. USER & EMPLOYEE ACCESS
const userRouter = Router();
userRouter.get('/', UserController.getUsers);
userRouter.post('/', validate(createUserSchema), UserController.createUser);
userRouter.get('/:id', UserController.getUserById);
userRouter.put('/:id', validate(updateUserSchema), UserController.updateUser);
userRouter.delete('/:id', UserController.deleteUser);
router.use('/users', userRouter);

// 4. PRODUCT & INVENTORY MASTER DATA
const productRouter = Router();
productRouter.get('/', ProductController.getProducts);
productRouter.get('/barcode/:barcode', ProductController.getProductByBarcode);
productRouter.get('/:id', ProductController.getProductById);
productRouter.post('/', validate(createProductSchema), ProductController.createProduct);
productRouter.put('/:id', validate(updateProductSchema), ProductController.updateProduct);
productRouter.delete('/:id', ProductController.deleteProduct);
router.use('/products', productRouter);

// 5. CUSTOMER MANAGEMENT
const customerRouter = Router();
customerRouter.get('/', CustomerController.getCustomers);
customerRouter.get('/:id', CustomerController.getCustomerById);
customerRouter.post('/', CustomerController.createCustomer);
customerRouter.put('/:id', CustomerController.updateCustomer);
customerRouter.delete('/:id', CustomerController.deleteCustomer);
router.use('/customers', customerRouter);

// 6. SUPPLIER & VENDOR MANAGEMENT
const supplierRouter = Router();
supplierRouter.get('/', SupplierController.getSuppliers);
supplierRouter.get('/:id', SupplierController.getSupplierById);
supplierRouter.post('/', SupplierController.createSupplier);
supplierRouter.put('/:id', SupplierController.updateSupplier);
supplierRouter.delete('/:id', SupplierController.deleteSupplier);
router.use('/suppliers', supplierRouter);

// 7. PROCUREMENT & PURCHASES
const purchaseRouter = Router();
purchaseRouter.get('/', PurchaseController.getPurchases);
purchaseRouter.get('/:id', PurchaseController.getPurchaseById);
purchaseRouter.post('/', PurchaseController.createPurchaseOrder);
purchaseRouter.post('/:id/receive', PurchaseController.receiveGoods);
router.use('/purchases', purchaseRouter);

// 8. SALES, POS & ZATCA E-INVOICING
const saleRouter = Router();
saleRouter.get('/', SaleController.getSales);
saleRouter.get('/:id', SaleController.getSaleById);
saleRouter.post('/', SaleController.createSaleInvoice);
router.use('/sales', saleRouter);

// 9. ACCOUNTING, GENERAL LEDGER & EXPENSES
const accountingRouter = Router();
accountingRouter.get('/accounts', AccountingController.getAccounts);
accountingRouter.post('/accounts', AccountingController.createAccount);
accountingRouter.get('/expenses', AccountingController.getExpenses);
accountingRouter.post('/expenses', AccountingController.recordExpense);
accountingRouter.get('/financial-summary', AccountingController.getFinancialSummary);
router.use('/accounting', accountingRouter);

// 10. HRM & SALARY & PAYROLL (WPS)
const hrmRouter = Router();
hrmRouter.get('/employees', HrmController.getEmployees);
hrmRouter.get('/employees/:id', HrmController.getEmployeeById);
hrmRouter.post('/employees', HrmController.createEmployee);
hrmRouter.post('/payroll/calculate', HrmController.calculatePayroll);
hrmRouter.get('/payroll', HrmController.getPayrolls);
hrmRouter.get('/payroll/:id', HrmController.getPayrollById);
hrmRouter.get('/payroll/:id/wps', HrmController.downloadWpsSif);
router.use('/hrm', hrmRouter);

export default router;
