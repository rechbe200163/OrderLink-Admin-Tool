'use server';

import { FormState } from '../form.types';

export async function billingAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    console.log('Billing action with formData:', {
      userTier: formData.get('userTier'),
      packages: formData.getAll('packages'),
    });
    return {
      ..._prevState,
      success: true,
    };
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
