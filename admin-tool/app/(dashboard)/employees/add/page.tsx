import { console } from 'inspector';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/utlis/getSession';
import { roleApiService } from '@/lib/api/concrete/roles';
import AddEmployeeDialog from '@/components/helpers/employees/AddEmployeeDialog';
import AddResourcePage from '@/components/add-ressource-page';

export default async function AddEmployeePage() {
  const { meta, data } = await roleApiService.getRoles();

  const t = await getTranslations('Dashboard.Ressource.Employees');
  return (
    <AddResourcePage title={t('buttons.add')}>
      <AddEmployeeDialog roles={data} />
    </AddResourcePage>
  );
}
