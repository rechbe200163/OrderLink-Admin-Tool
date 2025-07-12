import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import EditPermission from '@/components/helpers/permissions/EditPermission';
import { permissionsApiService } from '@/lib/api/concrete/permissions';
import { getTranslations } from 'next-intl/server';
import React from 'react';

interface EditPermissionPageProps {
  params: Promise<{
    permissionId: string;
  }>;
}

const EditPermissionPage = async (props: EditPermissionPageProps) => {
  const t = await getTranslations('Dashboard.Ressource');

  const params = await props.params;
  const permission = await permissionsApiService.getPermissionById(
    params.permissionId
  );
  return (
    <div className='p-5'>
      <BreadcrumbComponent
        items={[
          { label: t('BreadCrumps.title'), href: '/' },
          { label: t('Ressource.Permissions.BreadCrumps.title'), href: '/permissions/' },
          {
            label: t('Ressource.Permissions.BreadCrumps.edit'),
            href: `/permissions/${params.permissionId}/edit`,
          },
        ]}
      />
      <EditPermission permission={permission} />
    </div>
  );
};

export default EditPermissionPage;
