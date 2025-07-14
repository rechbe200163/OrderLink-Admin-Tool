import CreateRoutes from '@/components/helpers/routes/CreateRoute';
import { orderApiService } from '@/lib/api/concrete/orders';
import React from 'react';

async function CreateRoutePage() {
  const orders = await orderApiService.getAll();
  return <CreateRoutes orders={orders} />;
}

export default CreateRoutePage;
