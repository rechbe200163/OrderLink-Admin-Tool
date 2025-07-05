'use server';

import { FormState } from '../form.types';
import { apiPost, apiPut } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';

export async function createOrder(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      errors: {
        title: ['Not authenticated'],
      },
    };
  }
  try {
    await apiPost(ENDPOINTS.ORDERS, Object.fromEntries(formData));
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}

export async function updateOrder(
  orderId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      errors: {
        title: ['Not authenticated'],
      },
    };
  }
  try {
    await apiPut(ENDPOINTS.ORDER(orderId), Object.fromEntries(formData));
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}
