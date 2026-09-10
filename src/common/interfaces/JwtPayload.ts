export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
  companyId?: string;
  branchId?: string;
  warehouseId?: string;
}
