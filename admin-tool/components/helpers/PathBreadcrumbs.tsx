'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const resourceMap: Record<string, string> = {
  addresses: 'Address',
  categories: 'Categories',
  customers: 'Customers',
  employees: 'Employees',
  orders: 'Orders',
  products: 'Products',
  routes: 'Routes',
  permissions: 'Permissions',
  settings: 'Settings',
  subscriptions: 'Subscription',
};

export default function PathBreadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations('Dashboard');
  const navT = useTranslations('Navigation.Items');

  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs: { label: string; href?: string }[] = [];
  breadcrumbs.push({ label: t('Ressource.BreadCrumps.title'), href: '/' });

  let currentPath = '';
  let lastResourceKey: string | undefined;

  segments.forEach((segment) => {
    if (resourceMap[segment]) {
      lastResourceKey = resourceMap[segment];
      currentPath += `/${segment}`;
      breadcrumbs.push({
        label: t(`Ressource.${resourceMap[segment]}.BreadCrumps.title`),
        href: currentPath,
      });
    } else if ((segment === 'add' || segment === 'edit') && lastResourceKey) {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        label: t(`Ressource.${lastResourceKey}.BreadCrumps.${segment}`),
      });
    } else if (segment === 'statistics') {
      currentPath += `/${segment}`;
      breadcrumbs.push({ label: navT('statistics') });
    } else if (segment === 'mostlybought') {
      currentPath += `/${segment}`;
      breadcrumbs.push({ label: navT('mostlyBought') });
    } else if (segment === 'stock') {
      currentPath += `/${segment}`;
      breadcrumbs.push({ label: navT('stock') });
    } else {
      currentPath += `/${segment}`;
    }
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
