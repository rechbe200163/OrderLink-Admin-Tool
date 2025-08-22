import { getCookie } from '@/lib/cookies/cookie-managment';
import { Tenant, ModuleName } from '@/lib/types';

export async function isModuleEnabled(module: ModuleName): Promise<boolean> {
  console.log('checking module', module);
  const tenant = await getCookie<Tenant>('tenant');
  const enabled: string[] = tenant?.enabledModules ?? [];
  const isEnabled = enabled.includes(module);
  console.log('tenant', tenant?.enabledModules);
  console.log('enabled modules', isEnabled);

  return isEnabled;
}
