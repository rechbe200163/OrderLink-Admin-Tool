('server only');
import { BaseApiService } from '../base';
import {
  SiteConfigDto,
  SiteConfigWithAddress,
  SiteConfigWithTenantDto,
} from '@/lib/types';

class SiteConfigApiService extends BaseApiService {
  private static instance: SiteConfigApiService;

  static getInstance(): SiteConfigApiService {
    if (!this.instance) {
      this.instance = new SiteConfigApiService();
    }

    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getSiteConfig(): Promise<SiteConfigWithTenantDto> {
    const response = await this.get<SiteConfigWithTenantDto>('site-config');
    return response;
  }

  async getSiteConfigWithAddress(): Promise<SiteConfigWithAddress> {
    const response = await this.get<SiteConfigWithAddress>('site-config');
    return response;
  }

  async getSiteConfigForStripe(): Promise<SiteConfigDto> {
    return this.get<SiteConfigDto>('site-config-for-stripe');
  }
}

export const siteConfigApiService = SiteConfigApiService.getInstance();
