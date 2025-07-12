'server only';
import { BaseApiService } from '../base';
import { PagingDto } from '@/lib/dtos';
import { Permission } from '@/lib/types';

export class PermissionApiService extends BaseApiService {
  private static instance: PermissionApiService;

  public static getInstance(): PermissionApiService {
    if (!this.instance) {
      this.instance = new PermissionApiService();
    }
    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getPermissionById(permissionId: string): Promise<Permission> {
    return this.get<Permission>(`permissions/${permissionId}`);
  }

  async getAll(): Promise<Permission[]> {
    return this.get<Permission[]>('permissions/all');
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

export const permissionApiService = PermissionApiService.getInstance();
