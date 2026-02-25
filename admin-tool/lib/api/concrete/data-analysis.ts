'server only';
import { CustomerPredictionGrowth, OrderAmountResponse } from '@/lib/types';
import { BaseApiService } from '../base';

class DataAnalysisService extends BaseApiService {
  private static instance: DataAnalysisService;

  static getInstance(): DataAnalysisService {
    if (!this.instance) {
      this.instance = new DataAnalysisService();
    }
    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getOrderAmount(
    last_days?: number,
    month?: boolean,
    year?: boolean,
    show_zeros?: boolean,
  ): Promise<OrderAmountResponse> {
    const response = await this.get<OrderAmountResponse>(
      'data-analysis/orders-amount',
      {
        last_days,
        month,
        year,
        showzeros: show_zeros,
      },
    );
    return response;
  }

  async getCustomerGrowthPrediction(
    one_day: boolean = false,
    seven_days: boolean = false,
    month: boolean = true,
    year: boolean = false
  ): Promise<CustomerPredictionGrowth> {
    const response = await this.get<CustomerPredictionGrowth>(
      'data-analysis/customers-growth',
      {
        one_day,
        seven_days,
        month,
        year,
      },
    );
    return response;
  }
}

export const dataAnalysisService = DataAnalysisService.getInstance();
