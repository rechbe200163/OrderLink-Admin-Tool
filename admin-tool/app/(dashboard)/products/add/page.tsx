import { getTranslations } from 'next-intl/server';
import React from 'react';
import AddAddressPage from '../../addresses/add/page';
import AddResourcePage from '@/components/add-ressource-page';
import AddProductDialog from '@/components/helpers/products/AddProductDialog';

async function page() {
  const t = await getTranslations('Dashboard.Ressource.Products');
  return (
    <AddResourcePage title={t('buttons.add')}>
      <AddProductDialog />
    </AddResourcePage>
  );
}

export default page;
