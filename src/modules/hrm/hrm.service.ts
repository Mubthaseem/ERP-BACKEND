import { Employee, IEmployee, Payroll, IPayroll } from './hrm.model.js';
import { ApiError } from '../../common/errors/ApiError.js';
import { getPagination, IPaginationOptions } from '../../common/utils/pagination.js';

export class HrmService {
  static async createEmployee(data: Partial<IEmployee>) {
    const existing = await Employee.findOne({ employeeCode: data.employeeCode?.toUpperCase() });
    if (existing) throw ApiError.conflict(`Employee code ${data.employeeCode} already exists`);

    const basic = Number(data.basicSalary || 0);
    const housing = Number(data.housingAllowance || 0);
    const transport = Number(data.transportAllowance || 0);
    const other = Number(data.otherAllowance || 0);
    const totalSalary = basic + housing + transport + other;
    // Saudi GOSI deduction (~9.75% of basic + housing for Saudi nationals or 2% for expats)
    const gosiDeduction = Number(((basic + housing) * 0.0975).toFixed(2));

    return await Employee.create({
      ...data,
      employeeCode: data.employeeCode?.toUpperCase(),
      totalSalary,
      gosiDeduction,
    });
  }

  static async getEmployees(query: { search?: string; department?: string } & IPaginationOptions) {
    const { page, limit, skip } = getPagination(query);
    const filter: any = {};
    if (query.search) {
      filter.$or = [
        { nameEn: { $regex: query.search, $options: 'i' } },
        { nameAr: { $regex: query.search, $options: 'i' } },
        { employeeCode: { $regex: query.search, $options: 'i' } },
        { nationalIdOrIqama: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.department) filter.department = query.department;

    const [employees, total] = await Promise.all([
      Employee.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Employee.countDocuments(filter),
    ]);

    return { employees, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async getEmployeeById(id: string) {
    const emp = await Employee.findById(id);
    if (!emp) throw ApiError.notFound('Employee not found');
    return emp;
  }

  // Monthly Payroll Calculation
  static async calculateMonthlyPayroll(salaryMonth: string = new Date().toISOString().slice(0, 7)) {
    const employees = await Employee.find({ status: 'ACTIVE' });
    if (employees.length === 0) {
      throw ApiError.badRequest('No active employees found to calculate payroll');
    }

    const count = await Payroll.countDocuments();
    const payrollNumber = `PAY-${salaryMonth}-${String(count + 1).padStart(3, '0')}`;

    let grossSalary = 0;
    let gosiDeductions = 0;
    let netSalaryPayable = 0;

    const records = employees.map((emp) => {
      const basic = emp.basicSalary || 0;
      const housing = emp.housingAllowance || 0;
      const other = (emp.transportAllowance || 0) + (emp.otherAllowance || 0);
      const deductions = emp.gosiDeduction || 0;
      const net = basic + housing + other - deductions;

      grossSalary += basic + housing + other;
      gosiDeductions += deductions;
      netSalaryPayable += net;

      return {
        employeeId: emp._id.toString(),
        employeeCode: emp.employeeCode,
        name: emp.nameEn,
        nationalId: emp.nationalIdOrIqama,
        iban: emp.bankIban || 'SA0380000000608010167519',
        bankCode: emp.bankCode || 'RJHI',
        basicSalary: basic,
        housingAllowance: housing,
        otherAllowance: other,
        deductions,
        netSalary: Number(net.toFixed(2)),
      };
    });

    const payroll = await Payroll.create({
      payrollNumber,
      salaryMonth,
      staffCount: employees.length,
      grossSalary: Number(grossSalary.toFixed(2)),
      gosiDeductions: Number(gosiDeductions.toFixed(2)),
      netSalaryPayable: Number(netSalaryPayable.toFixed(2)),
      records,
      status: 'PAID',
    });

    return payroll;
  }

  static async getPayrolls() {
    return await Payroll.find().sort({ createdAt: -1 });
  }

  static async getPayrollById(id: string) {
    const payroll = await Payroll.findById(id);
    if (!payroll) throw ApiError.notFound('Payroll record not found');
    return payroll;
  }

  // Saudi / UAE Wage Protection System (WPS) SIF File Generator
  static async generateWpsSifContent(payrollId: string): Promise<{ filename: string; content: string }> {
    const payroll = await Payroll.findById(payrollId);
    if (!payroll) throw ApiError.notFound('Payroll run not found');

    const employerCR = '1010897654'; // Employer Commercial Registration
    const payerBankCode = 'RJHI';     // Al Rajhi Bank
    const creationDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const creationTime = new Date().toTimeString().slice(0, 8).replace(/:/g, '');

    // Header Record (SCR - Salary Control Record)
    // Format: SCR,EmployerCR,PayerBank,FileCreationDate,FileCreationTime,SalaryMonth,TotalSalary,TotalRecords,Currency
    const header = `SCR,${employerCR},${payerBankCode},${creationDate},${creationTime},${payroll.salaryMonth.replace('-', '')},${payroll.netSalaryPayable.toFixed(2)},${payroll.records.length},SAR\n`;

    // Detail Records (DCR - Detail Control Record)
    // Format: DCR,EmployeeID,EmployeeName,EmployeeBank,IBAN,BasicSalary,Housing,Other,Deductions,NetSalary
    const details = payroll.records
      .map(
        (rec) =>
          `DCR,${rec.nationalId},${rec.name.replace(/,/g, '')},${rec.bankCode},${rec.iban},${rec.basicSalary.toFixed(2)},${rec.housingAllowance.toFixed(2)},${rec.otherAllowance.toFixed(2)},${rec.deductions.toFixed(2)},${rec.netSalary.toFixed(2)}`
      )
      .join('\n');

    const content = header + details;
    const filename = `WPS_SIF_${payroll.payrollNumber}_${creationDate}.sif`;

    return { filename, content };
  }
}
