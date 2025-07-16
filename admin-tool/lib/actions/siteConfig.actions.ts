'use server';

import { FormState } from '../form.types';
import { apiPatch, formDataToPartial } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function updateSiteConfig(
  siteConfigId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPatch(
      ENDPOINTS.SITE_CONFIG_ID(siteConfigId),
      formDataToPartial(formData)
    );
    return { success: true } as FormState;
  }, 'Failed to update site config')) as FormState;
}
