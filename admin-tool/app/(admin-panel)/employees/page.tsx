import { auth } from '@/auth';
import { PlusCircle } from 'lucide-react';
import React from 'react';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import { employeesApiService } from '@/lib/api/concrete/employees';
import { EmployeesTable } from '@/components/helpers/employees/EmployeesTable';
import { Role } from '@prisma/client';
import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import { getTranslations } from 'next-intl/server';

export default async function EmployeesPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    query?: string;
    role?: string;
  }>;
}) {
  const session = await auth();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const query = searchParams?.query ? searchParams.query : '';
  const role = searchParams?.role ? searchParams.role : ('' as Role);

  const excludeEmployeeId = session.user.id;

  const employeesData = await employeesApiService.getEmployeesPaging(
    page,
    limit,
    query,
    role,
    excludeEmployeeId
  );
  const employees = employeesData.data;
  const { meta } = employeesData;

  const t = await getTranslations('Dashboard');

  const tFilter = await getTranslations('FilterAndSearch');
  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-10'>
        <BreadcrumbComponent
          items={[
            { label: t('Ressource.BreadCrumps.title'), href: '/' },
            {
              label: t('Ressource.Employees.BreadCrumps.title'),
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
              title={tFilter('Filter.Roles.title')}
              filterName='role'
              values={getRoleFilterKeys()}
            />
          </div>

          <ButtonLinkComponent
            href='/employees/add'
            label={t('Ressource.Employees.add')}
            icon={<PlusCircle />}
          />
        </div>
        <div className='bg-white rounded-lg shadow-md'>
          <EmployeesTable employees={employees} />
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

  function getRoleFilterKeys(): {
    label: string;
    value: string;
    color?: string;
  }[] {
    return Object.values(Role)
      .filter((role) => role !== 'CUSTOMER')
      .map((role) => ({
        label: tFilter(`Filter.Roles.options.${role.toLowerCase()}`),
        value: role,
      })) as { label: string; value: string }[];
  }
}
