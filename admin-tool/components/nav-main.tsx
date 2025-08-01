import { getCookie } from '@/lib/cookies/cookie-managment';
import { NavMainClient } from './nav-main-client';
import { Tenant } from '@/lib/types';

export async function NavMain() {
  const favoritesEnabled = false;
  return <NavMainClient favoritesEnabled={favoritesEnabled} />;
}
