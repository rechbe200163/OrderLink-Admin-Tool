'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const resourceKeyMap: Record<string, string> = {
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

export default function DynamicPageTitle() {
  const pathname = usePathname();
  const t = useTranslations('Navigation.Items');

  useEffect(() => {
    const defaultTitle = 'OrderLink';
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      document.title = defaultTitle;
      return;
    }

    const key = segments[0];
    const translationKey =
      resourceKeyMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
    let resourceTitle: string;
    try {
      resourceTitle = t(`${translationKey}`);
    } catch {
      resourceTitle = translationKey;
    }

    document.title = `${defaultTitle} | ${resourceTitle}`;
  }, [pathname, t]);

  return null;
}
