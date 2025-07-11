'server only';
import { BaseApiService } from '../base';
import { PagingDto } from '@/lib/dtos';
import { Employees } from '@/lib/types';

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

  async getAll(): Promise<Employees[]> {
    return this.get<Employees[]>('employees/all');
  }

  async getEmployeesPaging(
    page: number,
    limit: number,
    query?: string,
    role?: string,
    excludeEmployeeId?: string
  ): Promise<PagingDto<Employees>> {
    return this.get<PagingDto<Employees>>('employees', {
      page,
      limit,
      query,
      role,
      excludeEmployeeId,
    });
  }

  async findAdminEmployee(): Promise<Employees | null> {
    return await this.get<Employees | null>('employees/admin');
  }
}

export const employeesApiService = EmployeesApiService.getInstance();
