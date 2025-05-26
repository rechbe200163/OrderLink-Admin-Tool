'server only';
import { GetAllCategoriesPaging } from '@/lib/types';
import { BaseApiService } from '../base';
import { Category } from '@prisma/client';

class CategoryApiService extends BaseApiService {
  private static instance: CategoryApiService;

  static getInstance(): CategoryApiService {
    if (!this.instance) {
      this.instance = new CategoryApiService();
    }
    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.fetchFromApi<{ categories: Category[] }>(
      'categories',
      {},
      'read'
    );
    return response.categories;
  }

  async getCategroyById(categoryId: string): Promise<Category> {
    return this.fetchFromApi<Category>(`categories/${categoryId}`);
  }

  async getCategoriesPaging(
    page: number,
    limit: number,
    query?: string,
    filter?: string
  ): Promise<GetAllCategoriesPaging> {
    return this.fetchFromApi<GetAllCategoriesPaging>(
      'categories',
      { page, limit, query, filter },
      'read'
    );
  }
}

export const categoryApiService = CategoryApiService.getInstance();
