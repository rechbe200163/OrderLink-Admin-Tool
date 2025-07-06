'use server';

import { FormState } from '../form.types';

import { apiPost } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { getSession } from '../utlis/getSession';

export async function pauseSubscription(
  subId: string,
  siteConfigId: string
): Promise<FormState> {
  try {
    const session = await getSession();
    if (session?.user.role !== 'ADMIN') {
      return {
        success: false,
        errors: { title: ['Unauthorized'] },
        message: 'Unauthorized',
      };
    }

    await apiPost(ENDPOINTS.SUBSCRIPTION_PAUSE(subId), { siteConfigId });
    return { success: true };
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
    const session = await getSession();
    if (session?.user.role !== 'ADMIN') {
      return {
        success: false,
        errors: { title: ['Unauthorized'] },
        message: 'Unauthorized',
      };
    }

    await apiPost(ENDPOINTS.SUBSCRIPTION_CANCEL(subId), { siteConfigId });
    return { success: true };
  } catch (error) {
    console.error('Error pausing Subscription' + error);
    throw new Error('Error pausing Subscription' + error);
  }
}
