import { getCookie } from '@/lib/cookies/cookie-managment';
import { Tenant, ModuleName } from '@/lib/types';

export async function isModuleEnabled(module: ModuleName): Promise<boolean> {
  const tenant = await getCookie<Tenant>('tenant');
  const enabled = tenant?.enabledModules.map((m) => m.moduleName) || [];
  return enabled.includes(module);
}
