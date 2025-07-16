'use server';

import { FormState } from '../form.types';
import { apiPatch } from './api.actions';
import { formDataToPartial, getChangedFormData } from '../utils';
import { ENDPOINTS } from '../api/endpoints';
import { guardAction } from '../server-guard';

export async function updateSiteConfig(
  siteConfigId: string,
  current: Record<string, any>,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  return (await guardAction(async () => {
    await apiPatch(
      ENDPOINTS.SITE_CONFIG_ID(siteConfigId),
      getChangedFormData(current, formData)
    );
    return { success: true } as FormState;
  }, 'Failed to update site config')) as FormState;
}
