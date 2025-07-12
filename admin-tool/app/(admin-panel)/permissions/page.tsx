import { PlusCircle } from 'lucide-react';
import React from 'react';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import { permissionsApiService } from '@/lib/api/concrete/permissions';
import { PermissionsTable } from '@/components/helpers/permissions/PermissionsTable';
import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/utlis/getSession';
import { Role } from '@/lib/types';

export default async function PermissionsPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    role?: string;
  }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const role = searchParams?.role ? searchParams.role : ('' as Role);

  const permissionsData = await permissionsApiService.getPermissionsPaging(
    page,
    limit,
    role
  );
  const permissions = permissionsData.data;
  const { meta } = permissionsData;

  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');
  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-10'>
        <BreadcrumbComponent
          items={[
            { label: t('Ressource.BreadCrumps.title'), href: '/' },
            {
              label: t('Ressource.Permissions.BreadCrumps.title'),
              href: '/permissions/',
            },
          ]}
        />
      </div>
      <div className='container'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex justify-between items-center space-x-4'>
            <SearchComponent placeholder={tFilter('Search.searchForOption1')} />
            <FilteringComponent
              title={tFilter('Filter.Roles.title')}
              filterName='role'
              values={getRoleFilterKeys()}
            />
          </div>

          <ButtonLinkComponent
            href='/permissions/add'
            label={t('Ressource.Permissions.add')}
            icon={<PlusCircle />}
          />
        </div>
        <div className='bg-white rounded-lg shadow-md'>
          <PermissionsTable permissions={permissions} />
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

  function getRoleFilterKeys(): { label: string; value: string }[] {
    return Object.values(Role)
      .filter((role) => role !== 'CUSTOMER')
      .map((role) => ({
        label: tFilter(`Filter.Roles.options.${role.toLowerCase()}`),
        value: role,
      }));
  }
}
