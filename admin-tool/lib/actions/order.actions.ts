'use server';
import { auth } from '@/auth';
import { FormState } from '../form.types';
import { orderService } from '../services/OrderService';

export async function createOrder(
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
  return orderService.createOrder(formData);
}

export async function updateOrder(
  orderId: string,
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
  return orderService.updateOrder(orderId, formData);
}
