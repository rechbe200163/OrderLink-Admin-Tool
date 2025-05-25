'server only';
import { GetAllProductsPaging, ProductWithCategoryNames } from '@/lib/types';
import { BaseApiService } from '../base';
import { Product } from '@prisma/client';

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
    return this.fetchFromApi<Product[]>('products/all');
  }

  async getProductbyId(productId: string): Promise<ProductWithCategoryNames> {
    return await this.fetchFromApi<ProductWithCategoryNames>(
      `products/${productId}`
    );
  }

  async getProductsPaging(
    page: number,
    limit: number,
    query?: string,
    filter?: string,
    category?: string
  ): Promise<GetAllProductsPaging> {
    return this.fetchFromApi<GetAllProductsPaging>('products', {
      page,
      limit,
      query,
      filter,
      category,
    });
  }
}

export const productApiService = ProductApiService.getInstance();
