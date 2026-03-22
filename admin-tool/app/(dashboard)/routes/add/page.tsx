import AddResourcePage from '@/components/add-ressource-page';
import AddRouteDialog from '@/components/helpers/routes/AddRouteDialog';
import { getTranslations } from 'next-intl/server';
import React from 'react';

async function page() {
  const t = await getTranslations('Dashboard.Ressource.Routes.buttons');
  return (
    <AddResourcePage title={t('add')}>
      <AddRouteDialog />
    </AddResourcePage>
  );
}

export default page;
