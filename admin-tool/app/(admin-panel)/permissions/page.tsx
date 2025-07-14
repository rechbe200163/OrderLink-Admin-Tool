import { PlusCircle } from 'lucide-react';
import React from 'react';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import { permissionApiService } from '@/lib/api/concrete/permissions';
import PermissionsGrid from '@/components/helpers/permissions/PermissionsGrid';
import RoleSelect from '@/components/helpers/permissions/RoleSelect';

import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/utlis/getSession';
import { roleApiService } from '@/lib/api/concrete/roles';

export default async function PermissionsPage(props: {
  searchParams?: Promise<{ page?: string; limit?: string; role?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const roleParam = searchParams?.role as string | undefined;

  const allPermissions = await permissionApiService.getAll();

  console.log('All permissions:', JSON.stringify(allPermissions, null, 2));
  const roles = await roleApiService.getRoleNames(roleParam);

  if (!roles.length) {
    return <NoRolesError />;
  }

  const selectedRole =
    roleParam && roles.includes(roleParam) ? roleParam : roles[0];
  const permissions = allPermissions.filter((p) => p.role === selectedRole);

  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');

  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-10'>
      </div>
      <div className='container'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex justify-between items-center space-x-4'>
            <SearchComponent placeholder={tFilter('Search.searchForOption2')} />
            <RoleSelect roles={roles} value={selectedRole} />
          </div>
          <ButtonLinkComponent
            href='/permissions/add'
            label={t('Ressource.Permissions.add')}
            icon={<PlusCircle />}
          />
        </div>
        <div className='bg-background rounded-lg shadow-md p-4'>
          <PermissionsGrid permissions={permissions} role={selectedRole} />
        </div>
      </div>
    </div>
  );
}

// error component for no roles
export async function NoRolesError() {
  const t = await getTranslations('Dashboard');
  return (
    <div className='text-center p-6'>
      <h2 className='text-2xl font-bold mb-4'>
        {t('Ressource.Permissions.NoRoles.title')}
      </h2>
      <p className='text-gray-600'>
        {t('Ressource.Permissions.NoRoles.description')}
      </p>
    </div>
  );
}
