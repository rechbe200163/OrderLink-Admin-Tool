import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import EditCategory from '@/components/helpers/categories/EditCategory';
import { categoryApiService } from '@/lib/api/concrete/categories';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import React from 'react';

interface EditCategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

const EditCategoryPage = async (props: EditCategoryPageProps) => {
  const t = await getTranslations('Dashboard.Ressource');

  const params = await props.params;
  const category = await categoryApiService.getCategroyById(params.categoryId);
  return (
    <div className='p-5'>
      <BreadcrumbComponent
        items={[
          { label: t('BreadCrumps.title'), href: '/' },
          { label: t('Categories.BreadCrumps.title'), href: '/categories/' },
          {
            label: t('Categories.BreadCrumps.edit'),
            href: `/categories/${params.categoryId}/edit`,
          },
        ]}
      />
      <EditCategory category={category} />
    </div>
  );
};

export default EditCategoryPage;
