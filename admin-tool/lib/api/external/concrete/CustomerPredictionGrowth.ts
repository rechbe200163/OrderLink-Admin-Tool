import { ExternalApiService } from '../../externalBase';;

export type CustomerPredictionGrowthEntry = {
predictions: Record<string, number>;
typeofgraph: string;
};

export type CustomerPredictionGrowth = CustomerPredictionGrowthEntry;

class CustomerPredictionGrowthService extends ExternalApiService {
  private static instance: CustomerPredictionGrowthService;

  private constructor() {
    super();
  }

  static getInstance(): CustomerPredictionGrowthService {
    if (!CustomerPredictionGrowthService.instance) {
      CustomerPredictionGrowthService.instance = new CustomerPredictionGrowthService();
    }
    return CustomerPredictionGrowthService.instance;
  }

  async getCustomerGrowth(
    token: string,
    one_day: boolean = false,
    seven_days: boolean = false,
    month: boolean = true,
    year: boolean = false
  ): Promise<CustomerPredictionGrowth> {
    try {
      const params: Record<string, string> = {
      };

      if (one_day) params.one_day = 'true';
      if (seven_days) params.seven_days = 'true';
      if (month) params.month = 'true';
      if (year) params.year = 'true';


      const data = await this.fetchFromExternalApi<any>(
        token,
        'api/predictive/customers-growth/',
        params,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }
      );

      return {
        predictions: data.predictions,
        typeofgraph: data.typeofgraph,
      };
    } catch (error) {
      console.error('Error fetching customer growth:', error);
      return { predictions: {}, typeofgraph: '' };
    }
  }
}

export const customerPredictionGrowthService = CustomerPredictionGrowthService.getInstance();
