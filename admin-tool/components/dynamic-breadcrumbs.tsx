'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb'

const pathMap: Record<string, string> = {
  addresses: 'Address',
  categories: 'Categories',
  employees: 'Employees',
  customers: 'Customers',
  orders: 'Orders',
  products: 'Products',
  routes: 'Routes',
  permissions: 'Permissions',
  settings: 'Settings',
  statistics: 'Statistics',
  subscriptions: 'Subscriptions',
}

export default function DynamicBreadcrumbs() {
  const pathname = usePathname()
  const t = useTranslations('Dashboard.Ressource')
  const segments = pathname.split('/').filter(Boolean)
  const items: { label: string; href?: string }[] = []

  items.push({ label: t('BreadCrumps.title'), href: '/' })

  if (segments.length > 0) {
    const resourceKey = pathMap[segments[0]]
    if (resourceKey) {
      items.push({
        label: t(`${resourceKey}.BreadCrumps.title`),
        href: `/${segments[0]}`,
      })

      if (segments[1] === 'add') {
        items.push({ label: t(`${resourceKey}.BreadCrumps.add`) })
      } else if (segments[segments.length - 1] === 'edit') {
        items.push({ label: t(`${resourceKey}.BreadCrumps.edit`) })
      }
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage className='text-muted-foreground'>
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
