import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import CreateProductCard from '@/components/helpers/products/CreateProduct';
import { categoryApiService } from '@/lib/api/concrete/categories';
import React from 'react';
import { getTranslations } from 'next-intl/server';

async function CreateProductPage() {
  const categories = await categoryApiService.getCategories();
  const t = await getTranslations('Dashboard.Ressource');
  return (
    <div className='sticky top-0 z-10 px-4'>
      <BreadcrumbComponent
        items={[
          { label: t('BreadCrumps.title'), href: '/' },
          { label: t('Products.BreadCrumps.title'), href: '/products/' },
          { label: t('Products.BreadCrumps.add'), href: '/products/add' },
        ]}
      />

      <CreateProductCard categories={categories} />
    </div>
  );
}

export default CreateProductPage;
