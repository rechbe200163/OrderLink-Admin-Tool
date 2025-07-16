'use server';

import { FormState } from '../form.types';
import { apiPost, apiPatch, formDataToPartial } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function createCategory(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPost(ENDPOINTS.CATEGORIES, Object.fromEntries(formData));
    return { success: true } as FormState;
  }, 'Failed to create category')) as FormState;
}

export async function updateCategory(
  categoryId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPatch(
      ENDPOINTS.CATEGORY(categoryId),
      formDataToPartial(formData)
    );
    return { success: true } as FormState;
  }, 'Failed to update category')) as FormState;
}
