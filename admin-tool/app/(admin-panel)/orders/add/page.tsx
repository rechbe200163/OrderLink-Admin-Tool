import CreateOrder from '@/components/helpers/orders/CreateOrder';
import { customerApiService } from '@/lib/api/concrete/customers';
import { productApiService } from '@/lib/api/concrete/products';
import React from 'react';

async function CreateOrdersPage() {
  const products = await productApiService.getAll();
  const customers = await customerApiService.getAll();
  return (
    <div className='min-w-full p-5'>
      <CreateOrder customer={customers} products={products} />
    </div>
  );
}

export default CreateOrdersPage;
