'use server';
import { FormState } from '../form.types';
import { apiPatch, apiPost } from './api.actions';
import { getChangedFormData } from '../utils';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function createEmployee(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPost(ENDPOINTS.EMPLOYEES, Object.fromEntries(formData));
    return { success: true } as FormState;
  }, 'Failed to create employee')) as FormState;
}

export async function updateEmployee(
  employeeId: string,
  current: Record<string, any>,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPatch(
      ENDPOINTS.EMPLOYEE(employeeId),
      getChangedFormData(current, formData)
    );
    return { success: true } as FormState;
  }, 'Failed to update employee')) as FormState;
}

// export async function createInitialAdmin(
//   _prevState: FormState,
//   formData: FormData
// ): Promise<FormState> {
//   const resp = await employeeService.createInitialAdmin(formData);
//   if (resp.success) {
//     const cookieStore = await cookies();
//     cookieStore.set('isInitialAdminConfigured', 'true', {
//       secure: true,
//       maxAge: 60 * 60 * 24 * 7, // 1 week
//     });
//     await siteConfigService.setSiteConfigured(true);
//     redirect('/');
//   }
//   return resp;
// }
