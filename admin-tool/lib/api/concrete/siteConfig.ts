'server only';
import { BaseApiService } from '../base';
import { SiteConfigDto, SiteConfigWithAddress } from '@/lib/types';

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

  async getSiteConfig(): Promise<SiteConfigDto> {
    const response = await this.get<SiteConfigDto>('site-config');
    console.log('Site Config Response:', response);
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
