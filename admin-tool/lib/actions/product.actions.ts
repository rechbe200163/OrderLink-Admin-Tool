'use server';

import { FormState } from '../form.types';
import { hasPermission } from '../utlis/getSession';
import { apiPost, apiPut } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';

export async function createProduct(
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
    await apiPost(ENDPOINTS.PRODUCTS, Object.fromEntries(formData));
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}

export async function updateProduct(
  productId: string,
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

  if (!(await hasPermission('products', 'write'))) {
    return {
      success: false,
      errors: {
        title: ['Not authorized'],
      },
    };
  }
  try {
    await apiPut(ENDPOINTS.PRODUCT(productId), Object.fromEntries(formData));
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}
