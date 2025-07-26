'use server';

import { FormState } from '../form.types';
import { apiPost, apiPatch } from './api.actions';
import { formDataToOrder } from '../utils';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function createOrder(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log('Creating order with data:', Object.fromEntries(formData));
  return (await guardAction(async () => {
    await apiPost(ENDPOINTS.ORDERS, formDataToOrder(formData));
    return { success: true } as FormState;
  }, 'Failed to create order')) as FormState;
}

export async function updateOrder(
  orderId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPatch(ENDPOINTS.ORDER(orderId), formDataToOrder(formData));
    return { success: true } as FormState;
  }, 'Failed to update order')) as FormState;
}
