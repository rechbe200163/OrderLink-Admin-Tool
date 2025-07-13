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

  async getRoleNames(): Promise<string[]> {
    return this.get<string[]>('roles/roleNames');
  }
}

export const roleApiService = RoleApiService.getInstance();
