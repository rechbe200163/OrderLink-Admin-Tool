'use server';
import { FormState } from '../form.types';

import { apiPost, apiPatch } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function addCustomer(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPost(ENDPOINTS.CUSTOMERS, Object.fromEntries(formData));
    return { success: true } as FormState;
  }, 'Failed to add customer')) as FormState;
}

export async function deleteUser(
  customerReference: number
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPost(ENDPOINTS.CUSTOMER_DELETE(customerReference));
    return { success: true } as FormState;
  }, 'Failed to delete user')) as FormState;
}

export async function restoreUser(
  customerReference: number
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPost(ENDPOINTS.CUSTOMER_RESTORE(customerReference));
    return { success: true } as FormState;
  }, 'Failed to restore user')) as FormState;
}

export async function updateCustomer(
  customerReference: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPatch(
      ENDPOINTS.CUSTOMER(customerReference),
      Object.fromEntries(formData)
    );
    return { success: true } as FormState;
  }, 'Failed to update customer')) as FormState;
}
