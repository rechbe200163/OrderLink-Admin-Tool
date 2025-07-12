import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import CreatePermission from '@/components/helpers/permissions/CreatePermission';
import { getTranslations } from 'next-intl/server';

async function CreatePermissionPage() {
  const t = await getTranslations('Dashboard');
  return (
    <div className='min-w-full p-5'>
      <BreadcrumbComponent
        items={[
          { label: t('Ressource.BreadCrumps.title'), href: '/' },
          { label: t('Ressource.Permissions.BreadCrumps.title'), href: '/permissions/' },
          { label: t('Ressource.Permissions.BreadCrumps.add'), href: '/permissions/add' },
        ]}
      />
      <CreatePermission />
    </div>
  );
}

export default CreatePermissionPage;
