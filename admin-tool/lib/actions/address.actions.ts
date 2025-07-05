'use server';
import { FormState } from '../form.types';
import { apiPost, apiPut } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function createAddress(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(
    'addresses',
    'write',
    async () => {
      await apiPost(ENDPOINTS.ADDRESSES, Object.fromEntries(formData));
      return { success: true } as FormState;
    },
    'Failed to create address'
  )) as FormState;
}

export async function updateAddress(
  addressId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(
    'addresses',
    'write',
    async () => {
      await apiPut(ENDPOINTS.ADDRESS(addressId), Object.fromEntries(formData));
      return { success: true } as FormState;
    },
    'Failed to update address'
  )) as FormState;
}
