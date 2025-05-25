'server only';
import prisma from '@/prisma/client';
import { addressFormSchema } from '../utils';
import { FormState } from '../form.types';

class AddressService {
  private static instance: AddressService;

  public static getInstace(): AddressService {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService();
    }

    return AddressService.instance;
  }

  /**
   *
   * @param formData
   * @returns FormState
   */
  async createAddress(formData: FormData): Promise<FormState> {
    const validData = addressFormSchema.safeParse({
      country: formData.get('country')?.toString() || null,
      state: formData.get('state')?.toString() || null,
      city: formData.get('city')?.toString() || null,
      postCode: formData.get('postCode')?.toString() || null,
      streetName: formData.get('streetName')?.toString() || null,
      streetNumber: formData.get('streetNumber')?.toString() || null,
    });

    if (!validData.success) {
      return {
        success: false,
        errors: {
          title: ['Invalid form data'],
        },
      };
    }

    await prisma.address.create({
      data: {
        country: validData.data.country!,
        state: validData.data.state!,
        city: validData.data.city!,
        postCode: validData.data.postCode!,
        streetName: validData.data.streetName!,
        streetNumber: validData.data.streetNumber!,
      },
    });

    return { success: true };
  }

  async updateAddress(
    addressId: string,
    formData: FormData
  ): Promise<FormState> {
    // Validate input data
    const validData = addressFormSchema.safeParse({
      country: formData.get('country')?.toString() || null,
      state: formData.get('state')?.toString() || null,
      city: formData.get('city')?.toString() || null,
      postCode: formData.get('postCode')?.toString() || null,
      streetName: formData.get('streetName')?.toString() || null,
      streetNumber: formData.get('streetNumber')?.toString() || null,
    });

    console.log(validData.error?.flatten());

    if (!validData.success) {
      return {
        success: false,
        errors: {
          title: ['Invalid form data'],
        },
      };
    }

    // Soft delete the old product
    const oldAddress = await prisma.address.update({
      where: { addressId },
      data: { deleted: true },
    });

    const newAddress = await prisma.address.create({
      data: {
        country: validData.data.country || oldAddress.country,
        state: validData.data.state || oldAddress.state,
        city: validData.data.city || oldAddress.city,
        postCode: validData.data.postCode || oldAddress.postCode,
        streetName: validData.data.streetName || oldAddress.streetName,
        streetNumber: validData.data.streetNumber || oldAddress.streetNumber,
      },
    });

    return { success: true, data: newAddress.addressId };
  }
}

export const addressService = AddressService.getInstace();
