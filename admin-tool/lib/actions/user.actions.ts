'use server';
import { FormState } from '../form.types';

import { apiPost, apiPut } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function addCustomer(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    const data = Object.fromEntries(formData) as Record<string, any>;
    if (data.businessSector === 'N/A') {
      data.businessSector = undefined;
    }
    if (!data.companyNumber) {
      data.companyNumber = undefined;
    }
    await apiPost(ENDPOINTS.CUSTOMERS, data);
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
    const data = Object.fromEntries(formData) as Record<string, any>;
    if (data.businessSector === 'N/A') {
      data.businessSector = undefined;
    }
    if (!data.companyNumber) {
      data.companyNumber = undefined;
    }
    console.log('Updating customer with reference:', customerReference);
    console.log('Form data:', data);
    await apiPut(ENDPOINTS.CUSTOMER(customerReference), data);
    return { success: true } as FormState;
  }, 'Failed to update customer')) as FormState;
}
