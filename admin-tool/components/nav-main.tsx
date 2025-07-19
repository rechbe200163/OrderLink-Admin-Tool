import { NavMainClient } from './nav-main-client';

export async function NavMain() {
  const favoritesEnabled = false;
  return <NavMainClient favoritesEnabled={favoritesEnabled} />;
}
