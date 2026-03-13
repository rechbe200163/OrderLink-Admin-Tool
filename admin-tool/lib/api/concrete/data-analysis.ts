'server only';
import {
  CustomerPredictionGrowth,
  OrderAmountPercentageResponse,
  OrdersPredictionGrowth,
  ProductsMostlyBought,
  ProductsAmount,
  CustomerSignup,
  InvoicesAmount,
  CustomerSignupPercentage,
  InvoicesAmountPercentage,
} from '@/lib/types';
import { ApiResult, BaseApiService } from '../base';

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
    showzeros?: boolean,
    percentage?: boolean
  ): Promise<ApiResult<OrderAmountPercentageResponse>> {
    const response = await this.get<OrderAmountPercentageResponse>(
      'data-analysis/orders-amount',
      {
        last_days,
        month,
        year,
        showzeros,
        percentage
      },
    );
    return response;
  }

  async getProductsMostlyBought(
    last_days?: number,
    month?: boolean,
    year?: boolean,
    limit?: number,
  ): Promise<ApiResult<ProductsMostlyBought>> {
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
  ): Promise<ApiResult<CustomerPredictionGrowth>> {
    const response = await this.get<CustomerPredictionGrowth>(
      'data-analysis/customers-growth',
    );
    return response;
  }

  async getCustomerGrowthPredictionMonth(
  ): Promise<ApiResult<CustomerPredictionGrowth>> {
    const response = await this.get<CustomerPredictionGrowth>(
      'data-analysis/customers-growth-month',
    );
    return response;
  }

  async getOrdersGrowthPrediction(
  ): Promise<ApiResult<OrdersPredictionGrowth>> {
    const response = await this.get<OrdersPredictionGrowth>(
      'data-analysis/orders-growth'
    );
    return response;
  }

  async getOrdersGrowthPredictionMonth(
  ): Promise<ApiResult<OrdersPredictionGrowth>> {
    const response = await this.get<OrdersPredictionGrowth>(
      'data-analysis/orders-growth-month'
    );
    return response;
  }

  async getProductsAmount(
    well_stocked: boolean = false,
    out_of_stock: boolean = false,
    limit: number = 5,
  ): Promise<ApiResult<ProductsAmount>> {
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

  async getCustomerSignUps(
    last_days?: number,
    month?: boolean,
    year?: boolean,
    showzeros?: boolean,
    percentage?: boolean,
  ): Promise<ApiResult<CustomerSignup>> {
    const response = await this.get<CustomerSignup>(
      'data-analysis/customers-signup',
      {
        last_days,
        month,
        year,
        showzeros,
        percentage,
      }
    );
    return response;
  }

  async getCustomerSignUpsPercentage(
    last_days?: number,
    month?: boolean,
    year?: boolean,
    showzeros?: boolean,
    percentage?: boolean,
  ): Promise<ApiResult<CustomerSignupPercentage>> {
    const response = await this.get<CustomerSignupPercentage>(
      'data-analysis/customers-signup',
      {
        last_days,
        month,
        year,
        showzeros,
        percentage,
      }
    );
    return response;
  }

  async getInvoiceAmount(
    last_days?: number,
    month?: boolean,
    year?: boolean,
    showzeros?: boolean,
    percentage?: boolean
  ): Promise<ApiResult<InvoicesAmount>> {
    const response = await this.get<InvoicesAmount>(
      'data-analysis/invoices-amount',
      {
        last_days,
        month,
        year,
        showzeros,
        percentage
      },
    );
    return response;
  }

  async getInvoiceAmountPercentage(
    last_days?: number,
    month?: boolean,
    year?: boolean,
    showzeros?: boolean,
    percentage?: boolean
  ): Promise<ApiResult<InvoicesAmountPercentage>> {
    const response = await this.get<InvoicesAmountPercentage>(
      'data-analysis/invoices-amount',
      {
        last_days,
        month,
        year,
        showzeros,
        percentage
      },
    );
    return response;
  }
}

export const dataAnalysisService = DataAnalysisService.getInstance();
