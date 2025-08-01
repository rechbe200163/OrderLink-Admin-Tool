'use server';

import { ENDPOINTS } from '../api/endpoints';
import { FormState } from '../form.types';
import { guardAction } from '../server-guard';
import { formDataToPartial } from '../utils';
import { apiPost, apiUpgradeLicense } from './api.actions';

export async function billingAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    console.log('Billing action called with formData:', formData);
    return (await guardAction(async () => {
      const data = Object.fromEntries(formData) as Record<string, any>;
      const modules = formData.getAll('modules');
      if (modules.length) {
        data.modules = modules;
      }
      return await apiUpgradeLicense(ENDPOINTS.CHECK_OUT, data);
    }, 'Failed to create address')) as FormState;
  } catch (error) {
    console.error('Error occurred during billing action:', error);
    return {
      ..._prevState,
      success: false,
      errors: {
        title: ['An error occurred during billing. Please try again.'],
      },
    };
  }
}
