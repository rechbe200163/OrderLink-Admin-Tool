import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import CreatePermission from '@/components/helpers/permissions/CreatePermission';
import { getTranslations } from 'next-intl/server';
import React from 'react';

const AddPermissionPage = async () => {
  const t = await getTranslations('Dashboard.Ressource');
  return (
    <div className='p-5'>
      <BreadcrumbComponent
        items={[
          { label: t('BreadCrumps.title'), href: '/' },
          { label: t('Permissions.BreadCrumps.title'), href: '/permissions/' },
          { label: t('Permissions.BreadCrumps.add'), href: '/permissions/add' },
        ]}
      />
      <CreatePermission />
    </div>
  );
};

export default AddPermissionPage;
