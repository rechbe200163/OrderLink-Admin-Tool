'use server';

import { cookies } from 'next/headers';
import { FormState } from '../form.types';
import { redirect } from 'next/navigation';
import { hasPermission } from '../utlis/getSession';
import { siteConfigService } from '../services/SiteConfigService';
import { stripeService } from '../services/StripeService';
import { apiPut } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import prisma from '@/prisma/client';

export async function updateSiteConfig(
  siteConfigId: string,
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

  if (!(await hasPermission('siteConfig', 'write'))) {
    return {
      success: false,
      errors: {
        title: ['Not authorized'],
      },
    };
  }

  try {
    await apiPut(
      ENDPOINTS.SITE_CONFIG_ID(siteConfigId),
      Object.fromEntries(formData)
    );
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}

export async function createSiteConfig(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const resp = await siteConfigService.createSiteConfig(formData);

  if (!resp.success) {
    return resp;
  }

  // Ensure siteConfig exists
  const siteConfig = await prisma.siteConfig.findUnique({
    where: {
      siteConfigId: resp.data + '',
    },
  });
  if (!siteConfig) {
    return {
      success: false,
      errors: {
        title: [
          'Connecting to stripe account failed, you can try again after the onboarding process is complete',
        ],
      },
    };
  }

  const stripeAccountId = await stripeService.createConnectAccount(
    siteConfig.email
  );
  await siteConfigService.addStripeAccountId(stripeAccountId);

  const cookieStore = await cookies();
  cookieStore.set('isSiteConfigured', 'true', { maxAge: 60 * 60 * 24 * 7 });

  redirect('/onboarding/initialAdmin');
}
