import EditRoute from '@/components/helpers/routes/EditRoute';
import { orderApiService } from '@/lib/api/concrete/orders';
import { routeApiService } from '@/lib/api/concrete/route';
import React from 'react';

interface EditOrderPageProps {
  params: Promise<{
    routeId: string;
  }>;
}

async function EditRoutesPage(props: EditOrderPageProps) {
  const { routeId } = await props.params;
  const route = await routeApiService.getRouteById(routeId);
  const orders = await orderApiService.getAll();
  return (
    <div className='sticky top-0 bg-white z-10'>
      <EditRoute orders={orders} route={route} />
    </div>
  );
}

export default EditRoutesPage;
