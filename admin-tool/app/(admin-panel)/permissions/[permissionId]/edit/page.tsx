import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import EditPermission from '@/components/helpers/permissions/EditPermission';
import { permissionApiService } from '@/lib/api/concrete/permissions';
import { getTranslations } from 'next-intl/server';
import React from 'react';

interface EditPermissionPageProps {
  params: Promise<{ permissionId: string }>;
}

export default async function EditPermissionPage(props: EditPermissionPageProps) {
  const { permissionId } = await props.params;
  const permission = await permissionApiService.getPermissionById(permissionId);
  const t = await getTranslations('Dashboard');
  return (
    <div className='sticky top-0 bg-background z-10 px-4'>
      <BreadcrumbComponent
        items={[
          { label: t('Ressource.BreadCrumps.title'), href: '/' },
          { label: t('Ressource.Permissions.BreadCrumps.title'), href: '/permissions/' },
          { label: t('Ressource.Permissions.BreadCrumps.edit'), href: `/permissions/${permission.permissionId}/edit` },
        ]}
      />
      <EditPermission permission={permission} />
    </div>
  );
}
