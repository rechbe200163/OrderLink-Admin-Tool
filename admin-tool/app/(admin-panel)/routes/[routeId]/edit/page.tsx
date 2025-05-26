import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
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
    <div className='sticky top-0 bg-white z-10 px-4'>
      <BreadcrumbComponent
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Routen', href: '/routes' },
          { label: 'Bearbeiten', href: `/orders/${route.routeId}/edit` },
        ]}
      />
      <EditRoute orders={orders} route={route} />
    </div>
  );
}

export default EditRoutesPage;
