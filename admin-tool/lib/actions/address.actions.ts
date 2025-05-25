'use server';
import { auth } from '@/auth';
import { FormState } from '../form.types';
import { addressService } from '../services/AddressService';

export async function createAddress(
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

  return await addressService.createAddress(formData);
}

export async function updateAddress(
  addressId: string,
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

  return await addressService.updateAddress(addressId, formData);
}
