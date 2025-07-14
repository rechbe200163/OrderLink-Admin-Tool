import CreatePermission from '@/components/helpers/permissions/CreatePermission';
import { roleApiService } from '@/lib/api/concrete/roles';
import React from 'react';

const AddPermissionPage = async () => {
  const roles = await roleApiService.getRoleNames();
  return <CreatePermission roles={roles} />;
};

export default AddPermissionPage;
