import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import CreateOrder from '@/components/helpers/orders/CreateOrder';
import { customerApiService } from '@/lib/api/concrete/customers';
import { productApiService } from '@/lib/api/concrete/products';
import React from 'react';
import { getTranslations } from 'next-intl/server';

async function CreateOrdersPage() {
  const products = await productApiService.getAll();
  const customers = await customerApiService.getAll();
  const t = await getTranslations('Dashboard.Ressource');
  return (
    <div className='min-w-full p-5'>
      <BreadcrumbComponent
        items={[
          { label: t('BreadCrumps.title'), href: '/' },
          { label: t('Orders.BreadCrumps.title'), href: '/orders' },
          { label: t('Orders.BreadCrumps.add'), href: '/orders/add' },
        ]}
      />
      <CreateOrder customer={customers} products={products} />
    </div>
  );
}

export default CreateOrdersPage;
