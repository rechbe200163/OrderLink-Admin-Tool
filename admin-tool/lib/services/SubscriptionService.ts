'server only';
import { stripe } from '../stripeClient';
import { FormState } from '../form.types';
import { siteConfigService } from './SiteConfigService';

class SubscriptionService {
  private static instance: SubscriptionService;

  public static getInstace(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  async pauseSubscription(
    subId: string,
    siteConfigId: string
  ): Promise<FormState> {
    try {
      await stripe.subscriptions.update(subId, {
        pause_collection: { behavior: 'void' },
      });
      siteConfigService.updateUserPremiumState(false, siteConfigId);
      //revalidateTag('subscriptions');
      //revalidateTag('premium-status');
      return {
        success: true,
        message: 'Subscription paused',
      };
    } catch (error) {
      console.error('Error pausing subscription', error);
      return {
        success: false,
        errors: { title: ['error'] },
        message: 'Error pausing subscription',
      };
    }
  }

  async cancelSubscription(
    subId: string,
    siteConfigId: string
  ): Promise<FormState> {
    try {
      await stripe.subscriptions.cancel(subId, {
        cancellation_details: { comment: 'cancled' },
      });
      siteConfigService.updateUserPremiumState(false, siteConfigId);
      //revalidateTag('subscriptions');
      //revalidateTag('premium-status');
      return {
        success: true,
        message: 'Subscription canceld',
      };
    } catch (error) {
      return {
        success: false,
        errors: { title: ['error'] },
        message: 'Error cancling subscription' + error,
      };
    }
  }
}

export const subscriptionService = SubscriptionService.getInstace();
