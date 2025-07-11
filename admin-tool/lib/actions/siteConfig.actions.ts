'use server';

import { FormState } from '../form.types';
import { apiPut } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function updateSiteConfig(
  siteConfigId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(
    async () => {
      await apiPut(
        ENDPOINTS.SITE_CONFIG_ID(siteConfigId),
        Object.fromEntries(formData)
      );
      return { success: true } as FormState;
    },
    'Failed to update site config'
  )) as FormState;
}
