'use server';

import { FormState } from '../form.types';
import { apiPost, apiPut } from './api.actions';
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
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPut(ENDPOINTS.ROUTE(routeId), Object.fromEntries(formData));
    return { success: true } as FormState;
  }, 'Failed to update route')) as FormState;
}
