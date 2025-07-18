import NavMainClient from './nav-main-client';
import { favoritesFeatureFlag } from '@/lib/feature-flags/flags';

export async function NavMain() {
  const favoritesEnabled = await favoritesFeatureFlag();
  return <NavMainClient favoritesEnabled={favoritesEnabled} />;
}
