'use server';
import { auth } from '@/auth';
import { FormState } from '../form.types';
import { categoryService } from '../services/CategoryService';

export async function createCategory(
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

  return await categoryService.createCategory(formData);
}

export async function updateCategory(
  categoryId: string,
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

  return await categoryService.updateCategory(categoryId, formData);
}
