'server only';
import prisma from '@/prisma/client';
import { orderFormSchema, productFormSchema, routeFormSchema } from '../utils';
import { FormState } from '../form.types';
import { supabaseService } from '../utlis/SupabaseStorageService';

class RouteService {
  private static instance: RouteService;

  public static getInstace(): RouteService {
    if (!RouteService.instance) {
      RouteService.instance = new RouteService();
    }

    return RouteService.instance;
  }

  /**
   *
   * @param formData
   * @returns
   */
  async createRoute(formData: FormData): Promise<FormState> {
    const validData = routeFormSchema.safeParse({
      name: formData.get('name'),
      orderIds: formData.get('orderIds')?.toString(),
    });

    console.log(validData.error?.flatten());

    if (!validData.success) {
      return {
        success: false,
        errors: { title: ['Invalid form data'] },
      };
    }

    const { name, orderIds } = validData.data;
    console.log(validData.data);
    const orderIdArray = orderIds.split(',');

    try {
      const route = await prisma.route.create({
        data: {
          name: name,
          order: {
            createMany: { data: orderIdArray.map((orderId) => ({ orderId })) },
          },
        },
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: { title: ['An error occurred' + error] },
      };
    }
  }

  async updateRoute(routeId: string, formData: FormData): Promise<FormState> {
    const validData = routeFormSchema.safeParse({
      name: formData.get('name'),
      orderIds: formData.get('orderIds')?.toString(),
    });

    if (!validData.success) {
      return {
        success: false,
        errors: { title: ['Invalid form data'] },
      };
    }

    const { name, orderIds } = validData.data;

    const orderIdArray = orderIds.split(',');

    // Find existing order
    const oldRoute = await prisma.route.update({
      where: { routeId: routeId },
      data: { deleted: true },
    });

    if (!oldRoute) {
      return {
        success: false,
        errors: { title: ['Order not found'] },
      };
    }

    const newRoute = await prisma.route.create({
      data: {
        name: name,
        order: {
          createMany: { data: orderIdArray.map((orderId) => ({ orderId })) },
        },
      },
    });

    return {
      success: true,
      data: newRoute.routeId,
    };
  }
}

export const routeService = RouteService.getInstace();
