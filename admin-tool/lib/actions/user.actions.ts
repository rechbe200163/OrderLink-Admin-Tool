'use server';
import { FormState } from '../form.types';
import { auth } from '@/auth';
import { customerService } from '../services/CustomerService';

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

  return await customerService.addCustomer(prevState, formData);
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

  return await customerService.deleteUser(customerReference);
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

  return await customerService.restoreUser(customerReference);
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

  return await customerService.updateCustomer(customerReference, formData);
}
