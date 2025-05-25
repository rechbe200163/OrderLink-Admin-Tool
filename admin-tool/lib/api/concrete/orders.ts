'server only';
import { GetAllOrdersPaging, OrdersWithCustomerAndProducts } from '@/lib/types';
import { BaseApiService } from '../base';
import { start } from 'repl';
import { Order } from '@prisma/client';

export class OrderApiService extends BaseApiService {
  private static instance: OrderApiService;

  public static getInstance(): OrderApiService {
    if (!this.instance) {
      this.instance = new OrderApiService();
    }

    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getOrderById(orderId: string): Promise<OrdersWithCustomerAndProducts> {
    return this.fetchFromApi<OrdersWithCustomerAndProducts>(
      `orders/${orderId}`
    );
  }

  async getOrdersByRouteId(
    routeId: string
  ): Promise<OrdersWithCustomerAndProducts[]> {
    return this.fetchFromApi<OrdersWithCustomerAndProducts[]>(
      `orders/routes/${routeId}`
    );
  }

  async getAll(): Promise<Order[]> {
    return this.fetchFromApi<Order[]>('orders/all');
  }

  async getOrdersPaging(
    page: number,
    limit: number,
    query?: string,
    startDate?: string,
    endDate?: string
  ): Promise<GetAllOrdersPaging> {
    return this.fetchFromApi<GetAllOrdersPaging>('orders', {
      page,
      limit,
      query,
      startDate,
      endDate,
    });
  }
}

export const orderApiService = OrderApiService.getInstance();
