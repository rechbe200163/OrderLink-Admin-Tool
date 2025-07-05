import { BaseApiService } from '../base';
import {
  AIVStats,
  CustomerByBranch,
  CustomerStats,
  OrderStateCount,
  RevenueStats,
  SalesStates,
} from '@/lib/types';

class StatisticsAPiService extends BaseApiService {
  private static instance: StatisticsAPiService;

  static getInstance(): StatisticsAPiService {
    if (!this.instance) {
      this.instance = new StatisticsAPiService();
    }

    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getAvarageOrderValueStats(): Promise<AIVStats> {
    return this.get<AIVStats>('statistics/average-order-value');
  }

  async getSalesStats(): Promise<SalesStates> {
    return this.get<SalesStates>('statistics/sales');
  }

  async getRevenueStats(): Promise<RevenueStats> {
    return this.get<RevenueStats>('statistics/revenue');
  }

  async getCustomerCount(): Promise<CustomerByBranch> {
    const response = await this.get<CustomerByBranch>(
      'statistics/customers/business-sector'
    );
    return response;
  }

  async getCustomerSignUps(): Promise<CustomerStats> {
    const response = await this.get<CustomerStats>(
      'statistics/customers/monthly-signups'
    );
    return response;
  }

  async getOrderStateCount(): Promise<OrderStateCount> {
    const response = await this.get<OrderStateCount>('statistics/orders/state');
    return response;
  }
}

export const statisticsApiService = StatisticsAPiService.getInstance();
