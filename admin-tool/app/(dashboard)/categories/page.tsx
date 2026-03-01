import React from 'react';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import { CategoryTable } from '@/components/helpers/categories/CategoryTable';
import { categoryApiService } from '@/lib/api/concrete/categories';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/utlis/getSession';
import AddCategoryDialog from '@/components/helpers/categories/AddCategoryDialog';
import { SortOrder } from '@/lib/types';

export default async function CategoriesPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    sort?: string;
    order?: SortOrder;
    query?: string;
    filter?: string;
  }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const query = searchParams?.query ? searchParams.query : '';
  const filter = searchParams?.filter ? searchParams.filter : '';
  const sort = searchParams?.sort ? searchParams.sort : undefined;
  const order: SortOrder = searchParams?.order ? searchParams.order : 'desc';

  const categoryData = await categoryApiService.getCategoriesPaging(
    page,
    limit,
    sort,
    order,
    query,
    filter,
  );

  const categories = categoryData.data;
  const { meta } = categoryData;
  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');

  return (
    <div className='px-5 pt-5'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex justify-between items-center space-x-4'>
          <SearchComponent placeholder={tFilter('Search.searchForOption1')} />
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
        </div>

        <AddCategoryDialog />
      </div>
      <div className='flex-1 justify-between gap-1 flex flex-col'>
        <div className='min-w-full max-h-[calc(100vh-15rem)] overflow-auto'>
          <CategoryTable
            categories={categories}
            searchQuery={query}
            statusFilter={filter}
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
