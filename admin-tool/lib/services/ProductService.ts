'server only';
import prisma from '@/prisma/client';
import { productFormSchema } from '../utils';
import { FormState } from '../form.types';
import { supabaseService } from '../utlis/SupabaseStorageService';

class ProductService {
  private static instance: ProductService;

  public static getInstace(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }

    return ProductService.instance;
  }

  /**
   *
   * @param formData
   * @returns
   */
  async createProduct(formData: FormData): Promise<FormState> {
    try {
      const validData = productFormSchema.safeParse({
        name: formData.get('name')?.toString() || null,
        description: formData.get('description')?.toString() || null,
        price: formData.get('price')?.toString() || null,
        stock: formData.get('stock')?.toString() || null,
        imagePath: formData.get('image')?.toString() || null,
        categoryIds: formData.getAll('categoryIds') || [],
      });

      if (!validData.success) {
        return {
          success: false,
          errors: {
            title: ['Invalid form data'],
          },
        };
      }

      const filePath = await supabaseService.uploadFile(
        formData.get('image') as File
      );

      if (typeof filePath !== 'string') {
        return {
          success: false,
          errors: {
            title: ['Image processing failed'],
          },
        };
      }

      const newProduct = await prisma.product.create({
        data: {
          name: validData.data.name,
          description: validData.data.description,
          price: Number(validData.data.price),
          stock: Number(validData.data.stock),
          imagePath: filePath,
        },
      });

      await prisma.$transaction(
        validData.data.categoryIds.map((categoryId: string) =>
          prisma.categoriesOnProducts.create({
            data: {
              categoryId,
              productId: newProduct.productId,
            },
          })
        )
      );

      return { success: true };
    } catch (error) {
      throw new Error('Error creating product' + error);
    }
  }

  async updateProduct(
    productId: string,
    formData: FormData
  ): Promise<FormState> {
    // Validate input data
    try {
      const validData = productFormSchema.safeParse({
        name: formData.get('name')?.toString() || null,
        description: formData.get('description')?.toString() || null,
        price: formData.get('price')?.toString() || null,
        stock: formData.get('stock')?.toString() || null,
        imagePath: formData.get('image')?.toString() || null,
        categoryIds: formData.getAll('categoryIds') || [],
      });

      if (!validData.success) {
        return {
          success: false,
          errors: {
            title: ['Invalid form data'],
          },
        };
      }

      // Soft delete the old product
      const oldProduct = await prisma.product.update({
        where: { productId },
        data: { deleted: true },
        include: { categories: true }, // Fetch related categories
      });

      // Create new product with the same details (except ID & timestamps)
      let filePath: string = oldProduct.imagePath!;
      if (validData.data.imagePath) {
        const uploadedFilePath = await supabaseService.uploadFile(
          formData.get('image') as File
        );
        filePath = uploadedFilePath || filePath;

        if (typeof filePath !== 'string') {
          return {
            success: false,
            errors: {
              title: ['Image processing failed'],
            },
          };
        }
      }

      const newProduct = await prisma.product.create({
        data: {
          name: validData.data.name || oldProduct.name,
          description: validData.data.description || oldProduct.description,
          price: Number(validData.data.price) || oldProduct.price,
          stock: Number(validData.data.stock) || oldProduct.stock,
          imagePath: filePath,
          categories: {
            create: validData.data.categoryIds.map((categoryId: string) => ({
              categoryId,
            })),
          },
        },
      });

      return { success: true, data: newProduct.productId };
    } catch (error) {
      throw new Error('Error updating product' + error);
    }
  }
}

export const productService = ProductService.getInstace();
