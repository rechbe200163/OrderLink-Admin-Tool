'use server';

import { FormState } from '../form.types';
import { hasPermission } from '../utlis/getSession';
import { apiPost, apiPut } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';

export async function createRoute(
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

  if (!(await hasPermission('routes', 'write'))) {
    return {
      success: false,
      errors: {
        title: ['Not authorized'],
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
  const session = await auth();

  if (!session) {
    return {
      success: false,
      errors: {
        title: ['Not authenticated'],
      },
    };
  }

  if (!(await hasPermission('routes', 'write'))) {
    return {
      success: false,
      errors: {
        title: ['Not authorized'],
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
