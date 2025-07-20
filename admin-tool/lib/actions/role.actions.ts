'use server';

import { FormState } from '../form.types';
import { apiPost } from './api.actions';
import { guardAction } from '../server-guard';
import { ENDPOINTS } from '../api/endpoints';

export async function createRole(_prevState: FormState, formData: FormData): Promise<FormState> {
  return (await guardAction(async () => {
    const data = Object.fromEntries(formData);
    await apiPost(ENDPOINTS.ROLES, data);
    return { success: true } as FormState;
  }, 'Failed to create role')) as FormState;
}
