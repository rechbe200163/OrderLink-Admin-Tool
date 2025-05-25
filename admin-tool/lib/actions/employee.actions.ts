'use server';
import { auth } from '@/auth';
import { FormState } from '../form.types';
import { hasPermission } from '../utlis/getSession';
import { employeeService } from '../services/EmployeeService';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { siteConfigService } from '../services/SiteConfigService';

export async function createEmployee(
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

  if (!(await hasPermission('employees', 'write'))) {
    return {
      success: false,
      errors: {
        title: ['Not authorized'],
      },
    };
  }

  return await employeeService.createEmployee(formData);
}

export async function updateEmployee(
  employeeId: string,
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

  if (!(await hasPermission('employees', 'write'))) {
    return {
      success: false,
      errors: {
        title: ['Not authorized'],
      },
    };
  }

  return await employeeService.updateEmployee(employeeId, formData);
}

export async function createInitialAdmin(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const resp = await employeeService.createInitialAdmin(formData);
  if (resp.success) {
    const cookieStore = await cookies();
    cookieStore.set('isInitialAdminConfigured', 'true', {
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    await siteConfigService.setSiteConfigured(true);
    redirect('/');
  }
  return resp;
}
