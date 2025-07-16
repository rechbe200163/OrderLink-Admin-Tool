'use server';

import { FormState } from '../form.types';
import { apiPost, apiPatch } from './api.actions';
import { formDataToPartial, getChangedFormData } from '../utils';
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
  current: Record<string, any>,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPatch(
      ENDPOINTS.CATEGORY(categoryId),
      getChangedFormData(current, formData)
    );
    return { success: true } as FormState;
  }, 'Failed to update category')) as FormState;
}
