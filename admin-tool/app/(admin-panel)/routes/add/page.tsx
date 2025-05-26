import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import CreateRoutes from '@/components/helpers/routes/CreateRoute';
import { orderApiService } from '@/lib/api/concrete/orders';
import React from 'react';

async function CreateRoutePage() {
  const orders = await orderApiService.getAll();
  return (
    <div className='min-w-full p-5'>
      <BreadcrumbComponent
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Routen', href: '/routes' },
          { label: 'Hinzufügen', href: '/routes/add' },
        ]}
      />
      <CreateRoutes orders={orders} />
    </div>
  );
}

export default CreateRoutePage;
