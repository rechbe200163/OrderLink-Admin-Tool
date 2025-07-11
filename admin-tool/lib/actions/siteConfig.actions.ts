'use server';

import { FormState } from '../form.types';
import { getSession } from '../utlis/getSession';
import { apiPut } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';

export async function updateSiteConfig(
  siteConfigId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      errors: {
        title: ['Not authenticated'],
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
