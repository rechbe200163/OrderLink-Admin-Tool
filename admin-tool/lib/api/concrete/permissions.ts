'server only';
import { BaseApiService } from '../base';
import { PagingDto } from '@/lib/dtos';
import { Permission } from '@/lib/types';

class PermissionsApiService extends BaseApiService {
  private static instance: PermissionsApiService;

  static getInstance(): PermissionsApiService {
    if (!this.instance) {
      this.instance = new PermissionsApiService();
    }
    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getPermissionById(permissionId: string): Promise<Permission> {
    return this.get<Permission>(`permissions/${permissionId}`);
  }

  async getPermissionsPaging(
    page: number,
    limit: number,
    role?: string
  ): Promise<PagingDto<Permission>> {
    return this.get<PagingDto<Permission>>('permissions', {
      page,
      limit,
      role,
    });
  }
}

export const permissionsApiService = PermissionsApiService.getInstance();
