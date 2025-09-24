'use server';

import { FormState } from '../form.types';
import { apiPost, apiPatch } from './api.actions';
import { getChangedFormData } from '../utils';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function createProduct(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = new FormData();
  data.append('name', formData.get('name') as string);
  data.append('description', formData.get('description') as string);
  data.append('price', formData.get('price') as string);
  data.append('stock', formData.get('stock') as string);
  data.append('categoryId', formData.get('categoryId') as string);

  const file = formData.get('image') as File;
  if (file) {
    data.append('image', file);
  }

  console.log('data', data);

  console.log('Creating product with formData:', Object.fromEntries(formData));
  return (await guardAction(async () => {
    await apiPost(ENDPOINTS.PRODUCTS, data);
    return { success: true } as FormState;
  }, 'Failed to create product')) as FormState;
}

export async function updateProduct(
  productId: string,
  current: Record<string, any>,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPatch(
      ENDPOINTS.PRODUCT(productId),
      getChangedFormData(current, formData)
    );
    return { success: true } as FormState;
  }, 'Failed to update product')) as FormState;
}
