import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/utlis/getSession';
import { roleApiService } from '@/lib/api/concrete/roles';
import RoleSelect from '@/components/helpers/permissions/RoleSelect';
import { permissionApiService } from '@/lib/api/concrete/permissions';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import PermissionsGrid from '@/components/helpers/permissions/PermissionsGrid';
import AddRoleDialog from '@/components/helpers/roles/AddRoleDialog';
import AddPermissionDialog from '@/components/helpers/permissions/AddPermissionDialog';

export default async function PermissionsPage(props: {
  searchParams?: Promise<{ page?: string; limit?: string; role?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const roleParam = searchParams?.role as string | undefined;

  const allPermissions = await permissionApiService.getAll();

  const roles = await roleApiService.getRoleNames(roleParam);

  if (!roles.length) {
    return <NoRolesError />;
  }

  const selectedRole =
    roleParam && roles.includes(roleParam) ? roleParam : roles[0];
  const permissions = allPermissions.filter((p) => p.roleName === selectedRole);

  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');

  return (
    <div className='p-5'>
      <div className='sticky top-0 bg-background z-10'></div>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex justify-between items-center space-x-4'>
          <SearchComponent placeholder={tFilter('Search.searchForOption2')} />
          <RoleSelect roles={roles} value={selectedRole} />
          <AddRoleDialog />
        </div>
        <div className='flex space-x-2'>
          <AddPermissionDialog roles={roles} />
        </div>
      </div>
      <div className='bg-background rounded-lg shadow-md p-4'>
        <PermissionsGrid permissions={permissions} />
      </div>
    </div>
  );
}

// error component for no roles
async function NoRolesError() {
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
