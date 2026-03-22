import AddResourcePage from '@/components/add-ressource-page';
import AddAddressDialog from '@/components/helpers/addresses/AddAddressDialog';
import { get } from 'http';
import { getTranslations } from 'next-intl/server';
import React from 'react';

async function AddAddressPage() {
  const t = await getTranslations('Dashboard.Ressource.Address');
  return (
    <AddResourcePage title={t('buttons.add')}>
      <AddAddressDialog />
    </AddResourcePage>
  );
}

export default AddAddressPage;
