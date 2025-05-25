import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import CategoryForm from '@/components/helpers/categories/CreateCategory';
import { useTranslations } from 'next-intl';
import React from 'react';

const AddCategoryPage = () => {
  const t = useTranslations('Dashboard.Ressource');

  return (
    <div className='p-5'>
      <BreadcrumbComponent
        items={[
          { label: t('BreadCrumps.title'), href: '/' },
          { label: t('Categories.BreadCrumps.title'), href: '/categories/' },
          { label: t('Categories.BreadCrumps.add'), href: '/categories/add' },
        ]}
      />
      <CategoryForm />
    </div>
  );
};

export default AddCategoryPage;
