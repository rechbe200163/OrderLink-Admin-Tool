import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import CreateOrder from '@/components/helpers/orders/CreateOrder';
import { customerApiService } from '@/lib/api/concrete/customers';
import { productApiService } from '@/lib/api/concrete/products';
import React from 'react';

async function CreateOrdersPage() {
  const products = await productApiService.getAll();
  const customers = await customerApiService.getAll();
  return (
    <div className='min-w-full p-5'>
      <BreadcrumbComponent
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Orders', href: '/orders' },
          { label: 'Hinzufügen', href: '/orders/add' },
        ]}
      />
      <CreateOrder customer={customers} products={products} />
    </div>
  );
}

export default CreateOrdersPage;
