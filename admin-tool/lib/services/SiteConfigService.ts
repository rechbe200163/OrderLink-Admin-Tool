'server only';
import prisma from '@/prisma/client';
import { siteConfigFormSchema } from '../utils';
import { FormState } from '../form.types';
import { supabaseService } from '../utlis/SupabaseStorageService';
import path from 'path';
import fs from 'fs';

class SiteConfigService {
  private static instance: SiteConfigService;

  public static getInstance(): SiteConfigService {
    if (!SiteConfigService.instance)
      return (SiteConfigService.instance = new SiteConfigService());

    return SiteConfigService.instance;
  }

  async createSiteConfig(formData: FormData): Promise<FormState> {
    try {
      console.log('Form data:', formData);

      const validData = siteConfigFormSchema.safeParse({
        companyName: formData.get('companyName')?.toString() ?? '',
        email: formData.get('email')?.toString() ?? '',
        phoneNumber: formData.get('phoneNumber')?.toString() ?? '',
        iban: formData.get('maskInput')?.toString() ?? '',
        companyNumber: formData.get('companyNumber')?.toString() ?? '',
        country: formData.get('country')?.toString() ?? '',
        state: formData.get('state')?.toString() ?? '',
        city: formData.get('city')?.toString() ?? '',
        streetName: formData.get('streetName')?.toString() ?? '',
        postCode: formData.get('postCode')?.toString() ?? '',
        streetNumber: formData.get('streetNumber')?.toString() ?? '',
      });

      if (!validData.success) {
        console.log('Invalid form data:', validData.error.flatten());
        return { success: false, errors: { title: ['Invalid form data'] } };
      }

      const imageFile = formData.get('image') as File | null;

      let filePath: string | null = 'null';
      if (imageFile) {
        filePath = await supabaseService.uploadCompanyImage(imageFile);
        if (typeof filePath !== 'string') {
          return {
            success: false,
            errors: {
              title: ['Image processing failed'],
            },
          };
        }
      }

      const siteConfig = await prisma.siteConfig.create({
        data: {
          companyName: validData.data.companyName,
          logoPath: filePath,
          email: validData.data.email,
          phoneNumber: validData.data.phoneNumber,
          iban: validData.data.iban,
          companyNumber: validData.data.companyNumber,
          address: {
            create: {
              country: validData.data.country!,
              state: validData.data.state!,
              city: validData.data.city!,
              streetName: validData.data.streetName!,
              postCode: validData.data.postCode!,
              streetNumber: validData.data.streetNumber!,
            },
          },
          isPremium: false,
          deleted: false,
        },
      });

      return { success: true, data: siteConfig.siteConfigId };
    } catch (error) {
      throw new Error('Error creating site config' + error);
    }
  }

  async updateSiteConfig(
    siteConfigId: string,
    formData: FormData
  ): Promise<FormState> {
    try {
      console.log('Form data:', formData);
      const validData = siteConfigFormSchema.safeParse({
        companyName: formData.get('companyName')?.toString() ?? '',
        logoPath: formData.get('logo')?.toString() ?? '',
        email: formData.get('email')?.toString() ?? '',
        phoneNumber: formData.get('phoneNumber')?.toString() ?? '',
        iban: formData.get('maskInput')?.toString() ?? '',
        companyNumber: formData.get('companyNumber')?.toString() ?? '',
        addressId: formData.get('addressId')?.toString() ?? '',
      });

      if (!validData.success) {
        console.log('Invalid form data:', validData.error);
        return { success: false, errors: { title: ['Invalid form data'] } };
      }

      const oldSiteConfig = await prisma.siteConfig.update({
        where: { siteConfigId },
        data: {
          deleted: true,
        },
      });

      if (!oldSiteConfig) {
        return { success: false, errors: { title: ['Site config not found'] } };
      }

      console.log('Parsed form data:', validData);
      console.log('Old SiteConfig:', oldSiteConfig);

      const newSiteconfig = await prisma.siteConfig.create({
        data: {
          companyName: validData.data.companyName ?? oldSiteConfig.companyName,
          logoPath: validData.data.logoPath
            ? validData.data.logoPath
            : oldSiteConfig.logoPath, // Fix for empty string
          email: validData.data.email ?? oldSiteConfig.email,
          phoneNumber: validData.data.phoneNumber ?? oldSiteConfig.phoneNumber,
          iban: validData.data.iban ?? oldSiteConfig.iban,
          companyNumber:
            validData.data.companyNumber ?? oldSiteConfig.companyNumber,
          addressId: validData.data.addressId ?? oldSiteConfig.addressId,
          modifiedAt: new Date(),
          isPremium: oldSiteConfig.isPremium,
          deleted: false,
          stripeCustomerId: oldSiteConfig.stripeCustomerId,
        },
      });

      return { success: true, data: newSiteconfig.siteConfigId };
    } catch (error) {
      throw new Error('Error updating site config' + error);
    }
  }

  // async setSiteConfigured(setTo: boolean) {
  //   try {
  //     const config = await prisma.config.findFirst();
  //     await prisma.config.update({
  //       where: { configId: config?.configId },
  //       data: {
  //         configured: setTo,
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Error setting site configured:', error);
  //   }
  // }

  // async setStripeCustomerForSiteConfig(
  //   stripeCustomerId: string,
  //   siteConfigId: string
  // ) {
  //   try {
  //     await prisma.siteConfig.update({
  //       where: { siteConfigId: siteConfigId },
  //       data: {
  //         stripeCustomerId: stripeCustomerId,
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Error updating siteConfig:', error);
  //   }
  // }

  async updateUserPremiumState(isPremium: boolean, siteConfigId: string) {
    try {
      const siteConfig = await prisma.siteConfig.findFirst({
        select: {
          email: true,
        },
      });

      if (!siteConfig || !siteConfig.email) {
        throw new Error('No email found');
      }

      const { email } = siteConfig;

      await prisma.siteConfig.update({
        where: {
          siteConfigId,
        },
        data: {
          isPremium: {
            set: isPremium,
          },
        },
      });
    } catch (error) {
      throw new Error('Error updating user premium state' + error);
    }
  }
  async addStripeAccountId(stripeAccountId: string): Promise<void> {
    try {
      const siteConfig = await prisma.siteConfig.findFirst();
      await prisma.siteConfig.update({
        where: { siteConfigId: siteConfig?.siteConfigId },
        data: {
          stripeAccountId: stripeAccountId,
        },
      });
    } catch (error) {
      console.error('Error adding stripe account id:', error);
    }
  }
  async updateSiteConfigStripeConfigured(): Promise<void> {
    try {
      const siteConfig = await prisma.siteConfig.findFirst();
      await prisma.siteConfig.update({
        where: { siteConfigId: siteConfig?.siteConfigId },
        data: {
          stripeConfigured: true,
        },
      });
    } catch (error) {
      console.error('Error updating site config stripe configured:', error);
    }
  }
}

export const siteConfigService = SiteConfigService.getInstance();
