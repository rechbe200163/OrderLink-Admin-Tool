import AddResourcePage from '@/components/add-ressource-page';
import AddCustomerDialog from '@/components/helpers/customers/AddCustomerDialog';
import { getTranslations } from 'next-intl/server';

const AddCustomerPage = async () => {
  const t = await getTranslations('Dashboard.Ressource.Customers');

  return (
    <AddResourcePage title={t('buttons.add')}>
      <AddCustomerDialog />
    </AddResourcePage>
  );
};

export default AddCustomerPage;
