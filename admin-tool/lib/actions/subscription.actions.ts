'use server';

import { auth } from '@/auth';
import { FormState } from '../form.types';

import { subscriptionService } from '../services/SubscriptionService';

export async function pauseSubscription(
  subId: string,
  siteConfigId: string
): Promise<FormState> {
  try {
    const session = await auth();
    if (session?.user.role !== 'ADMIN') {
      return {
        success: false,
        errors: { title: ['Unauthorized'] },
        message: 'Unauthorized',
      };
    }

    return subscriptionService.pauseSubscription(subId, siteConfigId);
  } catch (error) {
    console.error('Error pausing Subscription' + error);
    throw new Error('Error pausing Subscription' + error);
  }
}
export async function cancleSubscription(
  subId: string,
  siteConfigId: string
): Promise<FormState> {
  try {
    const session = await auth();
    if (session?.user.role !== 'ADMIN') {
      return {
        success: false,
        errors: { title: ['Unauthorized'] },
        message: 'Unauthorized',
      };
    }

    return subscriptionService.cancelSubscription(subId, siteConfigId);
  } catch (error) {
    console.error('Error pausing Subscription' + error);
    throw new Error('Error pausing Subscription' + error);
  }
}
