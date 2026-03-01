import React from 'react';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import { employeesApiService } from '@/lib/api/concrete/employees';
import { EmployeesTable } from '@/components/helpers/employees/EmployeesTable';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/utlis/getSession';
import { SortOrder } from '@/lib/types';

export default async function EmployeesPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    sort?: string;
    order?: SortOrder;
    query?: string;
  }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const query = searchParams?.query ? searchParams.query : '';
  const sort = searchParams?.sort ? searchParams.sort : undefined;
  const order = searchParams?.order ? searchParams.order : 'asc';

  console.log('Search Params:', { page, limit, query, sort, order });

  const employeesData = await employeesApiService.getEmployeesPaging(
    page,
    limit,
    true,
    sort,
    order,
    query,
  );

  console.log('Employees Data:', employeesData);
  const employees = employeesData.data;
  const { meta } = employeesData;

  const t = await getTranslations('Dashboard');

  const tFilter = await getTranslations('FilterAndSearch');
  return (
    <div className='p-5'>
      <div className='sticky top-0 bg-background z-10'></div>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex justify-between items-center space-x-4'>
          <SearchComponent placeholder={tFilter('Search.searchForOption2')} />
          <FilteringComponent
            title={tFilter('Filter.Status.title')}
            filterName='filter'
            values={[
              {
                label: tFilter('Filter.Status.options.active'),
                value: 'active',
                color: 'green',
              },
              {
                label: tFilter('Filter.Status.options.inactive'),
                value: 'inactive',
                color: 'red',
              },
            ]}
          />
          {/* <FilteringComponent
            title={tFilter('Filter.Roles.title')}
            filterName='role'
            values={getRoleFilterKeys()}
          /> */}
        </div>

        {/* <AddEmployeeDialog roles={data} /> */}
      </div>
      <div className='min-w-full max-h-[calc(100vh-15rem)] overflow-auto'>
        <EmployeesTable employees={employees} searchQuery={query} />
      </div>
      <div className='mt-4 mb-5'>
        <PaginationComponent
          currentPage={meta.currentPage}
          totalPages={meta.pageCount}
          totalValues={meta.totalCount}
        />
      </div>
    </div>
  );
}
