'use server';

import { FormState } from '../form.types';
import { apiPost, apiPut } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function createPermission(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(
    async () => {
      const body = Object.fromEntries(formData);
      if ('allowed' in body) {
        body.allowed = body.allowed === 'true' || body.allowed === 'on';
      }
      await apiPost(ENDPOINTS.PERMISSIONS, body);
      return { success: true } as FormState;
    },
    'Failed to create permission'
  )) as FormState;
}

export async function updatePermission(
  permissionId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(
    async () => {
      await apiPut(
        ENDPOINTS.PERMISSION(permissionId),
        Object.fromEntries(formData)
      );
      return { success: true } as FormState;
    },
    'Failed to update permission'
  )) as FormState;
}
