import { PlusCircle } from 'lucide-react';
import React from 'react';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import { CategoryTable } from '@/components/helpers/categories/CategoryTable';
import { categoryApiService } from '@/lib/api/concrete/categories';
import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/utlis/getSession';

export default async function CategoriesPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
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

  const categoryData = await categoryApiService.getCategoriesPaging(
    page,
    limit,
    query,
    filter
  );
  const categories = categoryData.data;
  const { meta } = categoryData;
  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');

  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-10'>
        <BreadcrumbComponent
          items={[
            { label: t('Ressource.BreadCrumps.title'), href: '/' },
            {
              label: t('Ressource.Categories.BreadCrumps.title'),
              href: '/categories/',
            },
          ]}
        />
      </div>
      <div className='container'>
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

          <ButtonLinkComponent
            href='/categories/add'
            label={t('Ressource.Categories.add')}
            icon={<PlusCircle />}
          />
        </div>
        <div className='bg-white rounded-lg shadow-md'>
          <CategoryTable categories={categories} />
        </div>
        <div className='mt-4 mb-5'>
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
