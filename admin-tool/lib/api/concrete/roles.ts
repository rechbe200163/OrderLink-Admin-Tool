'server only';
import { BaseApiService } from '../base';

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

  async createRole(data: { name: string; description?: string }): Promise<void> {
    await this.post('roles', data);
  }
}

export const roleApiService = RoleApiService.getInstance();
