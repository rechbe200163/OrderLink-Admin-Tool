import { BaseApiService } from '../base';
import { AIVStats, RevenueStats, SalesStates } from '@/lib/types';

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
    return this.fetchFromApi<AIVStats>('customers?query=AIVStats');
  }

  async getSalesStats(): Promise<SalesStates> {
    return this.fetchFromApi<SalesStates>('invoices?query=salesStats');
  }

  async getRevenueStats(): Promise<RevenueStats> {
    return this.fetchFromApi<RevenueStats>('invoices?query=revenueStats');
  }
}

export const statisticsApiService = StatisticsAPiService.getInstance();
