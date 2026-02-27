'server only';
import { CustomerPredictionGrowth, OrderAmountResponse, OrdersPredictionGrowth, ProductsMostlyBought, ProductsAmount } from '@/lib/types';
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

  async getProductsMostlyBought(
    last_days?: number,
    month?: boolean,
    year?: boolean,
    limit?: number,
  ): Promise<ProductsMostlyBought> {
    const response = await this.get<ProductsMostlyBought>(
      'data-analysis/products-mostly-bought',
      {
        last_days,
        month,
        year,
        limit,
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

  async getOrdersGrowthPrediction(
    one_day: boolean = false,
    seven_days: boolean = false,
    month: boolean = true,
    year: boolean = false
  ): Promise<OrdersPredictionGrowth> {
    const response = await this.get<OrdersPredictionGrowth>(
      'data-analysis/orders-growth',
      {
        one_day,
        seven_days,
        month,
        year,
      },
    );
    return response;
  }

  async getProductsAmount(
    well_stocked: boolean = false,
    out_of_stock: boolean = false,
    limit: number = 5
  ): Promise<ProductsAmount> {
    const response = await this.get<ProductsAmount>(
      'data-analysis/products-amount',
      {
        well_stocked,
        out_of_stock,
        limit,
      },
    );
    return response;
  }
}

export const dataAnalysisService = DataAnalysisService.getInstance();
