'server only';
import {
  GetAllEmployeesPaging,
  GetAllOrdersPaging,
  OrdersWithCustomerAndProducts,
} from '@/lib/types';
import { BaseApiService } from '../base';
import { Employees, Order } from '@prisma/client';
import prisma from '@/prisma/client';

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
    return this.fetchFromApi<Employees>(`employees/${employeeId}`);
  }

  async getAll(): Promise<Employees[]> {
    return this.fetchFromApi<Employees[]>('employees/all');
  }

  async getEmployeesPaging(
    page: number,
    limit: number,
    query?: string,
    role?: string,
    excludeEmployeeId?: string
  ): Promise<GetAllEmployeesPaging> {
    return this.fetchFromApi<GetAllEmployeesPaging>('employees', {
      page,
      limit,
      query,
      role,
      excludeEmployeeId,
    });
  }

  async findAdminEmployee(): Promise<Employees | null> {
    return await prisma.employees.findFirst({
      where: {
        role: 'ADMIN',
      },
    });
  }
}

export const employeesApiService = EmployeesApiService.getInstance();
