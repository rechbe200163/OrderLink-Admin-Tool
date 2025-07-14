import CreateOrder from '@/components/helpers/orders/CreateOrder';
import { customerApiService } from '@/lib/api/concrete/customers';
import { productApiService } from '@/lib/api/concrete/products';
import React from 'react';

async function CreateOrdersPage() {
  const products = await productApiService.getAll();
  const customers = await customerApiService.getAll();
  return <CreateOrder customer={customers} products={products} />;
}

export default CreateOrdersPage;
