import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import CreateRoutes from '@/components/helpers/routes/CreateRoute';
import { orderApiService } from '@/lib/api/concrete/orders';
import { productApiService } from '@/lib/api/concrete/products';
import React from 'react';

async function CreateRoutePage() {
  const orders = await orderApiService.getAll();
  return (
    <div className='min-w-full p-5'>
      <BreadcrumbComponent
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Routes', href: '/routes' },
          { label: 'Add', href: '/routes/add' },
        ]}
      />
      <CreateRoutes orders={orders} />
    </div>
  );
}

export default CreateRoutePage;
