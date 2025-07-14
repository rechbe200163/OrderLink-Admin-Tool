import GoBackButtonComponent from '@/components/BackButtonComponent';
import { OrderTable } from '@/components/helpers/orders/OrdersTabel';
import { orderApiService } from '@/lib/api/concrete/orders';
import React from 'react';

interface OrderPerRoutePageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

async function EditProductPage(props: OrderPerRoutePageProps) {
  const { slug } = await props.params;
  const routeId = slug![0]!;
  const name = slug![1];
  const orders = await orderApiService.getOrdersByRouteId(routeId);
  return (
    <div className='min-w-full'>
      <div className='sticky top-0 bg-background z-10 px-4 flex justify-between items-center'>
        <div className='flex justify-between items-center mb-6'>
          <GoBackButtonComponent href='/routes' label='Go Back to Routes' />
        </div>
      </div>
      <div className='container mx-auto px-4 pb-5'>
        <div className='bg-white rounded-lg shadow-md'>
          <OrderTable orders={orders} />
        </div>
      </div>
    </div>
  );
}

export default EditProductPage;
