'server only';
import { ProductWithCategoryNames } from '@/lib/types';
import { BaseApiService } from '../base';
import { Product } from '@/lib/types';
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

  async getProductbyId(productId: string): Promise<ProductWithCategoryNames> {
    return await this.get<ProductWithCategoryNames>(`products/${productId}`);
  }

  async getProductsPaging(
    page: number,
    limit: number,
    query?: string,
    filter?: string,
    category?: string
  ): Promise<PagingDto<Product>> {
    return this.get<PagingDto<Product>>('products', {
      page,
      limit,
      query,
      filter,
      category,
    });
  }
}

export const productApiService = ProductApiService.getInstance();
