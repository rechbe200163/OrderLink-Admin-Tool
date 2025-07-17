import EditRoute from '@/components/helpers/routes/EditRoute';
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
  return (
    <div className='sticky top-0 bg-white z-10 px-4'>
      <EditRoute route={route} />
    </div>
  );
}

export default EditRoutesPage;
