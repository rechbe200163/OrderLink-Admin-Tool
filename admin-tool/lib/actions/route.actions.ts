'use server';

import { FormState } from '../form.types';
import { getSession } from '../utlis/getSession';
import { apiPost, apiPut } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';

export async function createRoute(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      errors: {
        title: ['Not authenticated'],
      },
    };
  }

  try {
    await apiPost(ENDPOINTS.ROUTES, Object.fromEntries(formData));
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}

export async function updateRoute(
  routeId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      errors: {
        title: ['Not authenticated'],
      },
    };
  }

  try {
    await apiPut(ENDPOINTS.ROUTE(routeId), Object.fromEntries(formData));
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}
