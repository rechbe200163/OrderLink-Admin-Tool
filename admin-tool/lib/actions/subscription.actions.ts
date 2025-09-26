'use server';

import { FormState } from '../form.types';

import { apiPost } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function pauseSubscription(
  subId: string,
  siteConfigId: string
): Promise<FormState> {
  return (await guardAction(async (session) => {
    if (session.user.roleName !== 'ADMIN') {
      return {
        success: false,
        errors: { title: ['Unauthorized'] },
        message: 'Unauthorized',
      } as FormState;
    }
    await apiPost(ENDPOINTS.SUBSCRIPTION_PAUSE(subId), { siteConfigId });
    return { success: true } as FormState;
  }, 'Failed to pause subscription')) as FormState;
}
export async function cancleSubscription(
  subId: string,
  siteConfigId: string
): Promise<FormState> {
  return (await guardAction(async (session) => {
    if (session.user.roleName !== 'ADMIN') {
      return {
        success: false,
        errors: { title: ['Unauthorized'] },
        message: 'Unauthorized',
      } as FormState;
    }
    await apiPost(ENDPOINTS.SUBSCRIPTION_CANCEL(subId), { siteConfigId });
    return { success: true } as FormState;
  }, 'Failed to cancel subscription')) as FormState;
}
