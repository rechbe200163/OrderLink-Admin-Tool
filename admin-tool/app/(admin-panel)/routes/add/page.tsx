import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import CreateRoutes from '@/components/helpers/routes/CreateRoute';
import { orderApiService } from '@/lib/api/concrete/orders';
import React from 'react';
import { getTranslations } from 'next-intl/server';

async function CreateRoutePage() {
  const orders = await orderApiService.getAll();
  const t = await getTranslations('Dashboard.Ressource');
  return (
    <div className='min-w-full p-5'>
      <BreadcrumbComponent
        items={[
          { label: t('BreadCrumps.title'), href: '/' },
          { label: t('Routes.BreadCrumps.title'), href: '/routes' },
          { label: t('Routes.BreadCrumps.add'), href: '/routes/add' },
        ]}
      />
      <CreateRoutes orders={orders} />
    </div>
  );
}

export default CreateRoutePage;
