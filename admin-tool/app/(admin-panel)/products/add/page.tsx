import CreateProductCard from '@/components/helpers/products/CreateProduct';
import { categoryApiService } from '@/lib/api/concrete/categories';
import React from 'react';

async function CreateProductPage() {
  const categories = await categoryApiService.getCategories();
  return (
    <div className='sticky top-0 z-10'>
      <CreateProductCard categories={categories} />
    </div>
  );
}

export default CreateProductPage;
