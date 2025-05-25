import GoBackButtonComponent from '@/components/BackButtonComponent';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import { OrderTable } from '@/components/helpers/orders/OrdersTabel';
import DateRangeSelectCompoent from '@/components/pagination+filtering/DateRangeSelectCompoent';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import { Button } from '@/components/ui/button';
import { orderApiService } from '@/lib/api/concrete/orders';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

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
      <div className='sticky top-0 bg-white z-10 px-4 flex justify-between items-center'>
        <BreadcrumbComponent
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Orders', href: '/orders/' },
            {
              label: `${decodeURIComponent(name!)}`,
              href: `/orders/routes/${routeId}/${name}`,
            },
          ]}
        />
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
