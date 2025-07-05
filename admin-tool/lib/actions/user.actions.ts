'use server';
import { FormState } from '../form.types';
import { auth } from '@/auth';
import { apiPost, apiPut } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';

export async function addCustomer(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      errors: {
        title: ['Not authenticated'],
      },
    };
  }

  try {
    await apiPost(ENDPOINTS.CUSTOMERS, Object.fromEntries(formData));
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}

export async function deleteUser(
  customerReference: number
): Promise<FormState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      errors: {
        title: ['Not authenticated'],
      },
    };
  }

  try {
    await apiPost(ENDPOINTS.CUSTOMER_DELETE(customerReference));
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}

export async function restoreUser(
  customerReference: number
): Promise<FormState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      errors: {
        title: ['Not authenticated'],
      },
    };
  }

  try {
    await apiPost(ENDPOINTS.CUSTOMER_RESTORE(customerReference));
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}

export async function updateCustomer(
  customerReference: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      errors: {
        title: ['Not authenticated'],
      },
    };
  }

  try {
    await apiPut(
      ENDPOINTS.CUSTOMER(customerReference),
      Object.fromEntries(formData)
    );
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}
