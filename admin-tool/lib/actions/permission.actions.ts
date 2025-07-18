'use server';

import { FormState } from '../form.types';
import { apiPost, apiPatch } from './api.actions';
import { getChangedFormData } from '../utils';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function createPermission(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    const data = Object.fromEntries(formData) as Record<string, any>;
    const actions = formData.getAll('actions');
    if (actions.length) {
      data.actions = actions;
    }
    if ('allowed' in data) {
      const allowed = formData.get('allowed');
      data.allowed = allowed === 'true' || allowed === 'on';
    }
    await apiPost(ENDPOINTS.PERMISSIONS, data);
    return { success: true } as FormState;
  }, 'Failed to create permission')) as FormState;
}

export async function updatePermission(
  permissionId: string,
  current: Record<string, any>,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    const data = getChangedFormData(current, formData) as Record<string, any>;
    if ('allowed' in data) {
      const allowed = formData.get('allowed');
      data.allowed = allowed === 'true' || allowed === 'on';
    }
    await apiPatch(ENDPOINTS.PERMISSION(permissionId), data);
    return { success: true } as FormState;
  }, 'Failed to update permission')) as FormState;
}
