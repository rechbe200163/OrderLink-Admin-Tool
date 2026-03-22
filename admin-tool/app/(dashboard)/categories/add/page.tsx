import AddResourcePage from '@/components/add-ressource-page';
import AddCategoryDialog from '@/components/helpers/categories/AddCategoryDialog';
import { getTranslations } from 'next-intl/server';
import React from 'react';

async function page() {
  const t = await getTranslations('Dashboard.Ressource.Categories');

  return (
    <AddResourcePage title={t('buttons.add')}>
      <AddCategoryDialog />
    </AddResourcePage>
  );
}

export default page;
