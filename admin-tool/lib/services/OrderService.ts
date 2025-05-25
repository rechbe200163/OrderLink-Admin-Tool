'server only';
import prisma from '@/prisma/client';
import { orderFormSchema, productFormSchema } from '../utils';
import { FormState } from '../form.types';
import { supabaseService } from '../utlis/SupabaseStorageService';

class OrderService {
  private static instance: OrderService;

  public static getInstace(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }

    return OrderService.instance;
  }

  /**
   *
   * @param formData
   * @returns
   */
  async createOrder(formData: FormData): Promise<FormState> {
    const quantityEntries = formData.entries();
    const quantity: { [key: string]: any } = {};
    for (const [key, value] of quantityEntries) {
      const match = key.match(/^quantity-(.*)/);
      if (match) {
        quantity[match[1]] = value;
      }
    }

    const validData = orderFormSchema.safeParse({
      customerReference: formData.get('customerReference'),
      productIds: formData.get('productIds')?.toString(),
      quantity,
      selfCollect: Boolean(formData.get('selfCollect')),
    });

    if (!validData.success) {
      return {
        success: false,
        errors: { title: ['Invalid form data'] },
      };
    }

    const {
      customerReference,
      productIds,
      quantity: validQuantity,
      selfCollect,
    } = validData.data;
    console.log(validData.data);
    const productIdsArray = productIds.split(',');

    try {
      const customer = await prisma.customer.findUnique({
        where: { customerReference: Number(customerReference) },
      });

      if (!customer) {
        return {
          success: false,
          errors: { title: ['Customer not found'] },
        };
      }

      const products = await prisma.product.findMany({
        where: { productId: { in: productIdsArray } },
      });

      if (products.length !== productIdsArray.length) {
        return {
          success: false,
          errors: { title: ['Some products not found'] },
        };
      }

      for (const product of products) {
        const quantityForProduct = Number(validQuantity[product.productId]);
        if (quantityForProduct > product.stock) {
          return {
            success: false,
            errors: { title: ['Insufficient stock for one or more products'] },
          };
        }
      }

      // decrement product stock
      for (const product of products) {
        await prisma.product.update({
          where: { productId: product.productId },
          data: {
            stock: {
              decrement: Number(validQuantity[product.productId]),
            },
          },
        });
      }

      await prisma.order.create({
        data: {
          customerReference: Number(customerReference),
          selfCollect: Boolean(selfCollect),
          products: {
            createMany: {
              data: products.map((product) => ({
                productId: product.productId,
                productAmount: Number(validQuantity[product.productId]),
              })),
            },
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

  async updateOrder(orderId: string, formData: FormData): Promise<FormState> {
    // Validate input data
    const quantityEntries = formData.entries();
    const quantity: { [key: string]: any } = {};
    for (const [key, value] of quantityEntries) {
      const match = key.match(/^quantity-(.*)/);
      if (match) {
        quantity[match[1]] = value;
      }
    }

    const validData = orderFormSchema.safeParse({
      customerReference: formData.get('customerReference'),
      productIds: formData.get('productIds')?.toString(),
      quantity,
      selfCollect: Boolean(formData.get('selfCollect')),
    });

    if (!validData.success) {
      return {
        success: false,
        errors: { title: ['Invalid form data'] },
      };
    }

    const {
      customerReference,
      productIds,
      quantity: validQuantity,
      selfCollect,
    } = validData.data;

    const productIdsArray = productIds.split(',');

    // Find existing order
    const order = await prisma.order.findUnique({
      where: { orderId: orderId },
      include: { products: true }, // To get related products in the order
    });

    if (!order) {
      return {
        success: false,
        errors: { title: ['Order not found'] },
      };
    }

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { customerReference: Number(customerReference) },
    });

    if (!customer) {
      return {
        success: false,
        errors: { title: ['Customer not found'] },
      };
    }

    // Soft delete the existing order
    await prisma.order.update({
      where: { orderId: orderId },
      data: { deleted: true },
    });

    // Prepare order items for the new order
    const orderItems = productIdsArray.map((productId) => {
      return {
        productId: productId,
        productAmount: Number(validQuantity[productId]),
      };
    });

    // Create a new order
    const newOrder = await prisma.order.create({
      data: {
        customerReference: Number(customerReference),
        selfCollect: Boolean(selfCollect),
        products: {
          createMany: {
            data: orderItems.map((item) => ({
              productId: item.productId,
              productAmount: item.productAmount,
            })),
          },
        },
      },
    });

    return {
      success: true,
      data: newOrder.orderId,
    };
  }
}

export const orderService = OrderService.getInstace();
