import { ExternalApiService } from '../../externalBase';

export type CustomerGrowthEntry = {
  date: string;
  growth: number;
  cumulative_growth: number;
};

export type CustomerGrowth = CustomerGrowthEntry[];

class CustomerGrowthService extends ExternalApiService {
  private static instance: CustomerGrowthService;

  private constructor() {
    super();
  }

  static getInstance(): CustomerGrowthService {
    if (!CustomerGrowthService.instance) {
      CustomerGrowthService.instance = new CustomerGrowthService();
    }
    return CustomerGrowthService.instance;
  }

  async getCustomerGrowth(
    token: string,
    last_days: number = 7,
    month: boolean = true,
    year: boolean = false
  ): Promise<CustomerGrowth> {
    try {
      const params: Record<string, string> = {
        last_days: String(last_days),
      };

      if (month) params.month = 'true';
      if (year) params.year = 'true';

      const data = await this.fetchFromExternalApi<any>(
        token,
        'descriptive/customers-signup/',
        params,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }
      );

      return Object.keys(data.cumulative_growth)
        .map((date) => ({
          date,
          growth: data.growth[date],
          cumulative_growth: data.cumulative_growth[date],
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    } catch (error) {
      console.error('Error fetching customer growth:', error);
      return [];
    }
  }
}

export const customerGrowthService = CustomerGrowthService.getInstance();
