import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import CreateEmployees from '@/components/helpers/employees/CreateEmployee';
import { roleApiService } from '@/lib/api/concrete/roles';
import { getTranslations } from 'next-intl/server';

async function CreateEmployeePage() {
  const t = await getTranslations('Dashboard');
  const roles = await roleApiService.getRoleNames();
  return (
    <div className='min-w-full p-5'>
      <BreadcrumbComponent
        items={[
          { label: t('Ressource.BreadCrumps.title'), href: '/' },
          {
            label: t('Ressource.Employees.BreadCrumps.title'),
            href: '/employees/',
          },
          {
            label: t('Ressource.Employees.BreadCrumps.add'),
            href: '/employees/add',
          },
        ]}
      />
      <CreateEmployees roles={roles} />
    </div>
  );
}

export default CreateEmployeePage;
