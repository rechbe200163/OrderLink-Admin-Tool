'server only';
import { Role } from '@/lib/types';
import { BaseApiService } from '../base';
import { PagingDto } from '@/lib/dtos';

export class RoleApiService extends BaseApiService {
  private static instance: RoleApiService;

  public static getInstance(): RoleApiService {
    if (!this.instance) {
      this.instance = new RoleApiService();
    }
    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getRoleNames(role?: string): Promise<string[]> {
    return this.get<string[]>('roles/roleNames', {
      role,
    });
  }

  async getRoles(
    limit: number = 20,
    page: number = 1,
    search?: string,
  ): Promise<PagingDto<Role>> {
    return this.get<PagingDto<Role>>('roles', {
      limit,
      page,
      search,
    });
  }

  async createRole(data: {
    name: string;
    description?: string;
  }): Promise<void> {
    await this.post('roles', data);
  }
}

export const roleApiService = RoleApiService.getInstance();
