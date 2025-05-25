'use server';
import { auth } from '@/auth';
import { FormState } from '../form.types';
import { productService } from '../services/ProductService';
import { hasPermission } from '../utlis/getSession';

export async function createProduct(
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

  return await productService.createProduct(formData);
}

export async function updateProduct(
  productId: string,
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

  if (!(await hasPermission('products', 'write'))) {
    return {
      success: false,
      errors: {
        title: ['Not authorized'],
      },
    };
  }
  return await productService.updateProduct(productId, formData);
}
