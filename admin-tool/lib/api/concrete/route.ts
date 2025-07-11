'server only';
import { RoutesWithOrders, RoutesWithCount } from '@/lib/types';
import { BaseApiService } from '../base';
import { Order } from '@/lib/types';
import { PagingDto } from '@/lib/dtos';

export class RouteApiService extends BaseApiService {
  private static instance: RouteApiService;

  public static getInstance(): RouteApiService {
    if (!this.instance) {
      this.instance = new RouteApiService();
    }

    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getRouteById(routeId: string): Promise<RoutesWithOrders> {
    return this.get<RoutesWithOrders>(`routes/${routeId}`);
  }

  async getAll(): Promise<Order[]> {
    return this.get<Order[]>('routes/all');
  }

  async getRoutesPaging(
    page: number,
    limit: number,
    query?: string
  ): Promise<PagingDto<RoutesWithCount>> {
    return this.get<PagingDto<RoutesWithCount>>('routes', {
      page,
      limit,
      query,
    });
  }
}

export const routeApiService = RouteApiService.getInstance();
