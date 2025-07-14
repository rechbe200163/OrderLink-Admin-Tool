import EditCategory from '@/components/helpers/categories/EditCategory';
import { categoryApiService } from '@/lib/api/concrete/categories';
import React from 'react';

interface EditCategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

const EditCategoryPage = async (props: EditCategoryPageProps) => {

  const params = await props.params;
  const category = await categoryApiService.getCategroyById(params.categoryId);
  return <EditCategory category={category} />;
};

export default EditCategoryPage;
