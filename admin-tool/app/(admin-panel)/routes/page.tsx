import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import { RoutesTable } from '@/components/helpers/routes/RouteTable';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import { routeApiService } from '@/lib/api/concrete/route';
import { getSession } from '@/lib/utlis/getSession';
import { PlusCircle } from 'lucide-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';

async function RoutesPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    query?: string;
  }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const query = searchParams?.query ? searchParams.query : '';

  const routeData = await routeApiService.getRoutesPaging(page, limit, query);

  const routes = routeData.data;

  console.log('RoutesPage', routes);
  const { meta } = routeData;
  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');

  return (
    <>
      <div className='sticky top-0 bg-background z-10'>
      </div>
      <div className='container'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex justify-between items-center space-x-4'>
            <SearchComponent placeholder={tFilter('Search.searchForOption1')} />
          </div>

          <ButtonLinkComponent
            href='/routes/add'
            label={t('Ressource.Routes.add')}
            icon={<PlusCircle />}
          />
        </div>
        <div className='bg-white rounded-lg shadow-md'>
          <RoutesTable routes={routes} />
        </div>
        <div className='mt-4 mb-5'>
          <PaginationComponent
            currentPage={meta.currentPage}
            totalPages={meta.pageCount}
            totalValues={meta.totalCount}
          />
        </div>
      </div>
    </>
  );
}

export default RoutesPage;
