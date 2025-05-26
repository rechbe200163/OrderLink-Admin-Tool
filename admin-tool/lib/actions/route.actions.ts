'use server';
import { auth } from '@/auth';
import { FormState } from '../form.types';
import { routeService } from '../services/RouteService';
import { hasPermission } from '../utlis/getSession';

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

  return await routeService.createRoute(formData);
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

  return await routeService.updateRoute(routeId, formData);
}
