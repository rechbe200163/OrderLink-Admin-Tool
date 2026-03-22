import AddResourcePage from '@/components/add-ressource-page';
import AddOrderDialog from '@/components/helpers/orders/AddOrderDialog';
import { getTranslations } from 'next-intl/server';
import React from 'react';

async function page() {
  const t = await getTranslations('Dashboard.Ressource.Orders');
  return (
    <AddResourcePage title={t('buttons.add')}>
      <AddOrderDialog />
    </AddResourcePage>
  );
}

export default page;
