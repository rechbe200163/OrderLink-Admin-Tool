'server only';
import prisma from '@/prisma/client';
import { categoryFormSchema } from '../utils';
import { FormState } from '../form.types';

class CategoryService {
  private static instance: CategoryService;

  public static getInstace(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }

    return CategoryService.instance;
  }

  /**
   *
   * @param formData FormData
   * @returns FormState
   */
  async createCategory(formData: FormData): Promise<FormState> {
    const validData = categoryFormSchema.safeParse({
      name: formData.get('name')?.toString(),
    });

    if (!validData.success) {
      return {
        success: false,
        errors: {
          title: ['Invalid form data'],
        },
      };
    }

    await prisma.category.create({
      data: {
        name: validData.data.name,
      },
    });

    return { success: true };
  }

  async updateCategory(
    categoryId: string,
    formData: FormData
  ): Promise<FormState> {
    // Validate input data
    const validData = categoryFormSchema.safeParse({
      name: formData.get('name')?.toString(),
    });

    if (!validData.success) {
      return {
        success: false,
        errors: {
          title: ['Invalid form data'],
        },
      };
    }

    // Soft delete the old category
    await prisma.category.update({
      where: { categoryId },
      data: { deleted: true },
    });

    const newCategory = await prisma.category.create({
      data: {
        name: validData.data.name,
      },
    });

    return { success: true, data: newCategory.categoryId };
  }
}

export const categoryService = CategoryService.getInstace();
