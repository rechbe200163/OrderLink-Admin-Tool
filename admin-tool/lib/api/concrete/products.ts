'server only';
import { ProductHistory, Product } from '@/lib/types';
import { BaseApiService } from '../base';
import { PagingDto } from '@/lib/dtos';

export class ProductApiService extends BaseApiService {
  private static instance: ProductApiService;

  public static getInstance(): ProductApiService {
    if (!this.instance) {
      this.instance = new ProductApiService();
    }

    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getAll(): Promise<Product[] & { cacheHit?: boolean }> {
    return this.get<Product[] & { cacheHit?: boolean }>('products/all');
  }

  async getProductbyId(
    productId: string,
  ): Promise<Product & { cacheHit?: boolean }> {
    return await this.get<Product & { cacheHit?: boolean }>(
      `products/${productId}`,
    );
  }

  async getProductHistory(productId: string): Promise<ProductHistory[]> {
    return await this.get<ProductHistory[]>(`products/history/${productId}`);
  }

  async getProductsPaging(
    page: number,
    limit: number,
    search?: string,
    categoryId?: string,
    filter?: string,
  ): Promise<PagingDto<Product> & { cacheHit?: boolean }> {
    return this.get<PagingDto<Product> & { cacheHit?: boolean }>('products', {
      page,
      limit,
      search,
      categoryId,
      filter,
    });
  }
}

export const productApiService = ProductApiService.getInstance();
