'server only';
import { BaseApiService } from '../base';
import { PagingDto } from '@/lib/dtos';
import { Employees, EmployeesWithRole, EmployeeWithOtp } from '@/lib/types';

export class EmployeesApiService extends BaseApiService {
  private static instance: EmployeesApiService;

  public static getInstance(): EmployeesApiService {
    if (!this.instance) {
      this.instance = new EmployeesApiService();
    }

    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getEmployeeById(employeeId: string): Promise<Employees> {
    return this.get<Employees>(`employees/${employeeId}`);
  }

  async getEmployeeWithOtp(employeeId: string): Promise<EmployeeWithOtp> {
    return this.get<EmployeeWithOtp>(`employees/${employeeId}`, {
      includeOtp: true,
    });
  }

  async getAll(): Promise<Employees[]> {
    return this.get<Employees[]>('employees/all');
  }

  async getEmployeesPaging(
    page: number,
    limit: number,
    includeRole: boolean,
    query?: string,
  ): Promise<PagingDto<EmployeesWithRole>> {
    return this.get<PagingDto<EmployeesWithRole>>('employees', {
      page,
      limit,
      includeRole,
      search: query,
    });
  }

  async findAdminEmployee(): Promise<Employees | null> {
    return await this.get<Employees | null>('employees/admin');
  }
}

export const employeesApiService = EmployeesApiService.getInstance();
