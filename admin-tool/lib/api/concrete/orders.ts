'server only';
import {
  OrdersWithAddressOfCustomer,
  OrdersWithCustomer,
  OrdersWithCustomerAndProducts,
} from '@/lib/types';
import { PagingDto } from '@/lib/dtos';
import { BaseApiService } from '../base';

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
    return this.get<OrdersWithCustomerAndProducts>(`orders/${orderId}`);
  }

  async getOrdersByRouteId(
    routeId: string,
  ): Promise<OrdersWithCustomerAndProducts[]> {
    return this.get<OrdersWithCustomerAndProducts[]>(
      `orders/routes/${routeId}`,
    );
  }

  async getAll(): Promise<OrdersWithAddressOfCustomer[]> {
    return this.get<OrdersWithAddressOfCustomer[]>('orders/all');
  }

  async getOrdersPaging(
    page: number,
    limit: number,
    sort?: string,
    order?: string,
    query?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<PagingDto<OrdersWithCustomer>> {
    return this.get<PagingDto<OrdersWithCustomer>>('orders', {
      page,
      limit,
      sort,
      order,
      query,
      startDate,
      endDate,
    });
  }
}

export const orderApiService = OrderApiService.getInstance();
