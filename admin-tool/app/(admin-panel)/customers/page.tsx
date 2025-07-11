import { PlusCircle } from 'lucide-react';
import React from 'react';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import { CustomerTable } from '@/components/helpers/customers/CustomerTable';
import { customerApiService } from '@/lib/api/concrete/customers';
import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/utlis/getSession';
import { BusinessSector } from '@/lib/types';

export default async function AdminPanelUsersPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
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

  const { meta, data } = await customerApiService.getCustomersPaging(
    page,
    limit,
    query,
    filter,
    businessSector
  );
  const customers = data;

  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');
  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-10'>
        <BreadcrumbComponent
          items={[
            { label: t('Ressource.BreadCrumps.title'), href: '/' },
            {
              label: t('Ressource.Customers.BreadCrumps.title'),
              href: '/customers/',
            },
          ]}
        />
      </div>
      <div className='container'>
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
            <FilteringComponent
              title={tFilter('Filter.BusinessSectors.title')}
              filterName='businessSector'
              values={[
                {
                  label: tFilter('Filter.BusinessSectors.options.private'),
                  value: 'private',
                },
                ...Object.values(BusinessSector).map((sector: string) => ({
                  label: tFilter(
                    `Filter.BusinessSectors.options.${sector.toLowerCase()}`
                  ),
                  value: sector,
                })),
              ]}
            />
          </div>

          <ButtonLinkComponent
            href='/customers/add'
            label={t('Ressource.Customers.add')}
            icon={<PlusCircle />}
          />
        </div>
        <div className='bg-white rounded-lg shadow-md'>
          <CustomerTable customers={customers} />
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
