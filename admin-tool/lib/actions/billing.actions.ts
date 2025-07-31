'use server';

import { FormState } from '../form.types';
import { formDataToPartial } from '../utils';

export async function billingAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const data = formDataToPartial(formData);
    console.log('Billing action with formData:', data);
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
