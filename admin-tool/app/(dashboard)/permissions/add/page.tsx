import CreatePermission from '@/components/helpers/permissions/CreatePermission';
import { roleApiService } from '@/lib/api/concrete/roles';
import React from 'react';

const AddPermissionPage = async () => {
  const roles = await roleApiService.getRoleNames();
  return (
    <div className='p-5'>
      <CreatePermission roles={roles} />
    </div>
  );
};

export default AddPermissionPage;
