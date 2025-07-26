'use server';
import { FormState } from '../form.types';
import { apiPatch, apiPost } from './api.actions';
import { getChangedFormData } from '../utils';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function updateProfile(
  current: Record<string, any>,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log('Updating profile with data:', formData);
  return (await guardAction(async () => {
    const data = getChangedFormData(current, formData) as Record<string, any>;
    await apiPatch(ENDPOINTS.UPDATE_ME, data);
    return { success: true } as FormState;
  }, 'Failed to update profile')) as FormState;
}

export async function requestPermissionAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    const data = Object.fromEntries(formData) as Record<string, any>;
    await apiPost(ENDPOINTS.PERMISSIONS, data);
    return { success: true } as FormState;
  }, 'Failed to request permission')) as FormState;
}
