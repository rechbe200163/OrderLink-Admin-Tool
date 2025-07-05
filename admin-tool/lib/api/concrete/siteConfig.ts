'server only';
import { SiteConfig } from '@prisma/client';
import { BaseApiService } from '../base';
import prisma from '@/prisma/client';
import { SiteConfigWithAddress } from '@/lib/types';

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

  async getSiteConfig(): Promise<SiteConfig> {
    const response = await this.get<{ siteConfig: SiteConfig }>(
      'siteConfig'
    );
    return response.siteConfig;
  }

  async getSiteConfigWithAddress(): Promise<SiteConfigWithAddress> {
    const response = await this.get<SiteConfigWithAddress>(
      'siteConfig?includeAddress=true'
    );
    return response;
  }

  async getPremiumStatus(): Promise<{ isPremium: boolean }> {
    const siteConfig = await prisma.siteConfig.findFirst();
    const isPremium = siteConfig?.isPremium ?? false;

    return { isPremium };
  }

  async getSiteConfigForStripe(): Promise<SiteConfig> {
    return this.get<SiteConfig>('siteConfigForStripe');
  }
}

export const siteConfigApiService = SiteConfigApiService.getInstance();
