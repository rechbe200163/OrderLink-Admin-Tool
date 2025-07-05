'server only';
import {
  CustomerStats,
  CustomerWithAddressId,
  GetAllUserPaging,
} from '@/lib/types';
import { BusinessSector, Customer } from '@prisma/client';
import { BaseApiService } from '../base';

class CustomerApiService extends BaseApiService {
  private static instance: CustomerApiService;

  static getInstance(): CustomerApiService {
    if (!this.instance) {
      this.instance = new CustomerApiService();
    }

    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getAll(): Promise<Customer[]> {
    return this.get<Customer[]>('customers/all');
  }

  async getCustomerStats(): Promise<CustomerStats> {
    return this.get<CustomerStats>('customers', {
      stats: 'customerStats',
    });
  }

  async getCustomersPaging(
    page: number,
    limit: number,
    query?: string,
    filter?: string,
    businessSector?: BusinessSector | 'n/a'
  ): Promise<GetAllUserPaging> {
    return this.get<GetAllUserPaging>('customers', {
      page,
      limit,
      query,
      filter,
      businessSector,
    });
  }

  async getCustomerByReference(
    customerReference: string
  ): Promise<CustomerWithAddressId> {
    return this.get(`customers/${customerReference}`);
  }
}

export const customerApiService = CustomerApiService.getInstance();
