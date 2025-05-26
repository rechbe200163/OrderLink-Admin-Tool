import { ExternalApiService } from '../../externalBase';

export type OrderGrowth = {
  date: string;
  growth: number;
  cumulative_growth: number;
}[];

class OrderStatsService extends ExternalApiService {
  private static instance: OrderStatsService;

  private constructor() {
    super();
  }

  static getInstance(): OrderStatsService {
    if (!OrderStatsService.instance) {
      OrderStatsService.instance = new OrderStatsService();
    }
    return OrderStatsService.instance;
  }

  async getProductsGrowth(
    token: string,
    limit: number = 10,
    well_stocked: boolean = false,
    out_of_stock: boolean = false
  ): Promise<OrderGrowth> {
    try {
      const params: Record<string, string> = {
        limit: String(limit),
      };

      if (well_stocked) params.well_stocked = 'true';
      if (out_of_stock) params.out_of_stock = 'true';

      const data = await this.fetchFromExternalApi<any>(
        token,
        'descriptive/orders-amount/',
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
      console.error('Error fetching products growth:', error);
      throw new Error('Failed to fetch products growth data');
    }
  }
}

export const ordersStatsService = OrderStatsService.getInstance();
