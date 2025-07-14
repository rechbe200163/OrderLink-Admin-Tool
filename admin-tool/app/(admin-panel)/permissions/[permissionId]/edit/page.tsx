import EditPermission from '@/components/helpers/permissions/EditPermission';
import { permissionApiService } from '@/lib/api/concrete/permissions';
import React from 'react';

interface EditPermissionPageProps {
  params: Promise<{ permissionId: string }>;
}

export default async function EditPermissionPage(props: EditPermissionPageProps) {
  const { permissionId } = await props.params;
  const permission = await permissionApiService.getPermissionById(permissionId);
  return (
    <div className='sticky top-0 bg-background z-10'>
      <EditPermission permission={permission} />
    </div>
  );
}
