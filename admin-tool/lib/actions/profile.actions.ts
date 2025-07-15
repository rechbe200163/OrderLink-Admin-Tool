'use server';
import { FormState } from '../form.types';
import { apiPut, apiPost } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function updateProfile(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  return (await guardAction(async () => {
    const data = Object.fromEntries(formData) as Record<string, any>;
    await apiPut(ENDPOINTS.USER_ME, data);
    return { success: true } as FormState;
  }, 'Failed to update profile')) as FormState;
}

export async function requestPermissionAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  return (await guardAction(async () => {
    const data = Object.fromEntries(formData) as Record<string, any>;
    await apiPost(ENDPOINTS.PERMISSIONS, data);
    return { success: true } as FormState;
  }, 'Failed to request permission')) as FormState;
}
