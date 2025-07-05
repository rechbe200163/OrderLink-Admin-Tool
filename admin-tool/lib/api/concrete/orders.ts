'server only';
import {
  OrdersWithAddressOfCustomer,
  OrdersWithCustomerAndProducts,
} from '@/lib/types';
import { PagingDto } from '@/lib/dtos';
import { BaseApiService } from '../base';
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
    return this.get<OrdersWithCustomerAndProducts>(
      `orders/${orderId}`
    );
  }

  async getOrdersByRouteId(
    routeId: string
  ): Promise<OrdersWithCustomerAndProducts[]> {
    return this.get<OrdersWithCustomerAndProducts[]>(
      `orders/routes/${routeId}`
    );
  }

  async getAll(): Promise<OrdersWithAddressOfCustomer[]> {
    return this.get<OrdersWithAddressOfCustomer[]>('orders/all');
  }

  async getOrdersPaging(
    page: number,
    limit: number,
    query?: string,
    startDate?: string,
    endDate?: string
  ): Promise<PagingDto<OrdersWithCustomer>> {
    return this.get<PagingDto<OrdersWithCustomer>>('orders', {
      page,
      limit,
      query,
      startDate,
      endDate,
    });
  }
}

export const orderApiService = OrderApiService.getInstance();
