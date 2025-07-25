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

  async getAll(): Promise<Product[]> {
    return this.get<Product[]>('products/all');
  }

  async getProductbyId(productId: string): Promise<Product> {
    return await this.get<Product>(`products/${productId}`);
  }

  async getProductHistory(productId: string): Promise<ProductHistory[]> {
    return await this.get<ProductHistory[]>(`products/history/${productId}`);
  }

  async getProductsPaging(
    page: number,
    limit: number,
    search?: string,
    categoryId?: string,
    filter?: string
  ): Promise<PagingDto<Product>> {
    return this.get<PagingDto<Product>>('products', {
      page,
      limit,
      search,
      categoryId,
      filter,
    });
  }
}

export const productApiService = ProductApiService.getInstance();
