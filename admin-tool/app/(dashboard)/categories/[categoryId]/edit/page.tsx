import EditCategory from '@/components/helpers/categories/EditCategory';
import { categoryApiService } from '@/lib/api/concrete/categories';
import React from 'react';
import { fetchCategories } from '@/dummyDataForStaticBuild';

interface EditCategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

const EditCategoryPage = async (props: EditCategoryPageProps) => {

  const params = await props.params;
  const category = await categoryApiService.getCategroyById(params.categoryId);
  return (
    <div className='p-5'>
      <EditCategory category={category} />
    </div>
  );
};

export default EditCategoryPage;

export async function generateStaticParams() {
  const categories = await fetchCategories();
  return categories.map((c) => ({ categoryId: c.id }));
}
