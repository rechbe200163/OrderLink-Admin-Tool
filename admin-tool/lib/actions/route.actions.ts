'use server';

import { FormState } from '../form.types';
import { apiPost, apiPatch } from './api.actions';
import { getChangedFormData } from '../utils';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function createRoute(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPost(ENDPOINTS.ROUTES, Object.fromEntries(formData));
    return { success: true } as FormState;
  }, 'Failed to create route')) as FormState;
}

export async function updateRoute(
  routeId: string,
  current: Record<string, any>,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPatch(
      ENDPOINTS.ROUTE(routeId),
      getChangedFormData(current, formData)
    );
    return { success: true } as FormState;
  }, 'Failed to update route')) as FormState;
}
