'server only';
import { stripe } from '../stripeClient';

class StripeService {
  private static instance: StripeService;
  private stripeClient;
  private domain: string;

  constructor() {
    this.stripeClient = stripe;
    this.domain = process.env.NEXT_PUBLIC_DOMAIN!;
  }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async createConnectAccount(email: string): Promise<string> {
    const account = await this.stripeClient.accounts.create({
      type: 'express',
      email,
    });
    return account.id;
  }

  async createAccountLink(
    accountId: string
  ): Promise<{ url: string; expiresAt: number } | undefined> {
    const accountLink = await this.stripeClient.accountLinks.create({
      account: accountId,
      refresh_url: `${this.domain}/auth/signin`,
      return_url: `${this.domain}/onboarding/setup`,
      type: 'account_onboarding',
    });
    return {
      url: accountLink.url,
      expiresAt: accountLink.expires_at,
    };
  }
}

export const stripeService = StripeService.getInstance();
