'use server';
import { FormState } from '../form.types';
import { apiPost, apiPatch } from './api.actions';
import { formDataToPartial, getChangedFormData } from '../utils';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';
import { Address } from '../types';

export async function createAddress(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    const created = await apiPost<Address>(
      ENDPOINTS.ADDRESSES,
      Object.fromEntries(formData)
    );
    return { success: true, data: created.addressId } as FormState;
  }, 'Failed to create address')) as FormState;
}

export async function updateAddress(
  addressId: string,
  current: Record<string, any>,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPatch(
      ENDPOINTS.ADDRESS(addressId),
      getChangedFormData(current, formData)
    );
    return { success: true } as FormState;
  }, 'Failed to update address')) as FormState;
}
