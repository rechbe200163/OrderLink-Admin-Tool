'server only';
import { BaseApiService } from '../base';
import { Category, SortOrder } from '@/lib/types';
import { PagingDto } from '@/lib/dtos';

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
    const response = await this.get<{ categories: Category[] }>(
      'categories',
      {},
    );
    return response.categories;
  }

  async getCategroyById(categoryId: string): Promise<Category> {
    return this.get<Category>(`categories/${categoryId}`);
  }

  async getCategoriesPaging(
    page: number,
    limit: number,
    sort?: string,
    order?: SortOrder,
    query?: string,
    filter?: string,
  ): Promise<PagingDto<Category>> {
    return this.get<PagingDto<Category>>('categories', {
      page,
      limit,
      sort,
      order,
      query,
      filter,
    });
  }
}

export const categoryApiService = CategoryApiService.getInstance();
