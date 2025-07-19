'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const resourceMap: Record<string, string> = {
  addresses: 'addresses',
  categories: 'categories',
  customers: 'customers',
  employees: 'employees',
  orders: 'orders',
  products: 'products',
  routes: 'routes',
  permissions: 'permissions',
  settings: 'settings',
  subscriptions: 'subscriptions',
};

export default function MetadataTitleUpdater() {
  const pathname = usePathname();
  const t = useTranslations('Navigation.Items');

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    let title = 'OrderLink';
    const key = resourceMap[segments[0]];
    if (key) {
      title = `OrderLink | ${t(key)}`;
    }
    if (typeof document !== 'undefined') {
      document.title = title;
    }
  }, [pathname, t]);

  return null;
}
