import { auth } from '@/auth';
import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import { OrderTable } from '@/components/helpers/orders/OrdersTabel';
import { RoutesTable } from '@/components/helpers/routes/RouteTable';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import { Button } from '@/components/ui/button';
import { routeApiService } from '@/lib/api/concrete/route';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

async function RoutesPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    query?: string;
  }>;
}) {
  const session = await auth();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const query = searchParams?.query ? searchParams.query : '';

  const { routes, totalRoutes, totalPages } =
    await routeApiService.getRoutesPaging(page, limit, query);

  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-10'>
        <BreadcrumbComponent
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Routes', href: '/routes/' },
          ]}
        />
      </div>
      <div className='container'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex justify-between items-center space-x-4'>
            <SearchComponent placeholder={'Nach Name suchen'} />
          </div>

          <ButtonLinkComponent
            href='/routes/add'
            label='Neue Route'
            icon={<PlusCircle />}
          />
        </div>
        <div className='bg-white rounded-lg shadow-md'>
          <RoutesTable routes={routes} />
        </div>
        <div className='mt-4 mb-5'>
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            totalValues={totalRoutes}
          />
        </div>
      </div>
    </div>
  );
}

export default RoutesPage;
