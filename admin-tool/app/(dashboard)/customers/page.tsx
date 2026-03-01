import React from 'react';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
// import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import { CustomerTable } from '@/components/helpers/customers/CustomerTable';
import { customerApiService } from '@/lib/api/concrete/customers';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/utlis/getSession';
import { BusinessSector, SortOrder } from '@/lib/types';
import AddCustomerDialog from '@/components/helpers/customers/AddCustomerDialog';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';

export default async function AdminPanelUsersPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    sort?: string;
    order?: SortOrder;
    query?: string;
    filter?: string;
    businessSector?: BusinessSector;
  }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const query = searchParams?.query ? searchParams.query : '';
  const filter = searchParams?.filter ? searchParams.filter : '';
  const businessSector = searchParams?.businessSector;
  const sort = searchParams?.sort ? searchParams.sort : undefined;
  const order = searchParams?.order ? searchParams.order : 'asc';

  const { meta, data } = await customerApiService.getCustomersPaging(
    page,
    limit,
    sort,
    order,
    query,
    filter,
    businessSector,
  );
  const customers = data;

  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');
  return (
    <div className='px-5 pt-5'>
      <div className='flex justify-between items-center mb-5'>
        <div className='flex justify-between items-center space-x-4'>
          <SearchComponent placeholder={tFilter('Search.searchForOption2')} />
          <FilteringComponent
            title={tFilter('Filter.BusinessSectors.title')}
            filterName='businessSector'
            values={Object.values(BusinessSector).map((sector) => ({
              label: tFilter(
                `Filter.BusinessSectors.options.${sector.toLocaleLowerCase()}`,
              ),
              value: sector,
            }))}
          />
        </div>

        <AddCustomerDialog />
      </div>
      <div className='flex-1 justify-between gap-1 flex flex-col'>
        <div className='min-w-full max-h-[calc(100vh-15rem)] overflow-auto'>
          <CustomerTable
            customers={customers}
            searchQuery={query}
            businessSectorFilter={businessSector}
          />
        </div>
        <div>
          <PaginationComponent
            currentPage={meta.currentPage}
            totalPages={meta.pageCount}
            totalValues={meta.totalCount}
          />
        </div>
      </div>
    </div>
  );
}
