import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import { orderApiService } from '@/lib/api/concrete/orders';
import { OrderTable } from '@/components/helpers/orders/OrdersTabel';
import DateRangeSelectCompoent from '@/components/pagination+filtering/DateRangeSelectCompoent';
import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import { getTranslations } from 'next-intl/server';

export default async function OrdersPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    query?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const session = await auth();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const startDate = searchParams?.startDate ? searchParams.startDate : '';
  const endDate = searchParams?.endDate ? searchParams.endDate : '';
  const query = searchParams?.query ? searchParams.query : '';

  const { orders, totalOrders, totalPages } =
    await orderApiService.getOrdersPaging(
      page,
      limit,
      query,
      startDate,
      endDate
    );
  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');

  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-10'>
        <BreadcrumbComponent
          items={[
            { label: t('Ressource.BreadCrumps.title'), href: '/' },
            {
              label: t('Ressource.Orders.BreadCrumps.title'),
              href: '/orders/',
            },
          ]}
        />
      </div>
      <div className='container'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex justify-between items-center space-x-4'>
            <SearchComponent placeholder={tFilter('Search.searchForOption2')} />
            <DateRangeSelectCompoent />
          </div>

          <ButtonLinkComponent
            href='/orders/add'
            label={t('Ressource.Orders.add')}
            icon={<PlusCircle />}
          />
        </div>
        <div className='bg-white rounded-lg shadow-md'>
          <OrderTable orders={orders} />
        </div>
        <div className='mt-4 mb-5'>
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            totalValues={totalOrders}
          />
        </div>
      </div>
    </div>
  );
}
