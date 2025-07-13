'use server';

import { FormState } from '../form.types';
import { apiPost, apiPatch } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function createProduct(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPost(ENDPOINTS.PRODUCTS, Object.fromEntries(formData));
    return { success: true } as FormState;
  }, 'Failed to create product')) as FormState;
}

export async function updateProduct(
  productId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPatch(ENDPOINTS.PRODUCT(productId), Object.fromEntries(formData));
    return { success: true } as FormState;
  }, 'Failed to update product')) as FormState;
}
