'server only';
import { OrderAmountResponse } from '@/lib/types';
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
}

export const dataAnalysisService = DataAnalysisService.getInstance();
