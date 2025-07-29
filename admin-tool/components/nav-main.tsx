import { getCookie } from '@/lib/cookies/cookie-managment';
import { NavMainClient } from './nav-main-client';
import { Tenant } from '@/lib/types';

export async function NavMain() {
  const favoritesEnabled = false;
  const tenant = await getCookie<Tenant>('tenant');
  const enabledModules =
    tenant?.enabledModules.flatMap((module) => module.moduleName) || [];
  console.log('Enabled Modules:', enabledModules);
  return <NavMainClient favoritesEnabled={favoritesEnabled} />;
}
