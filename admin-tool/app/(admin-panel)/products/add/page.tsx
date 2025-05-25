import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import CreateProductCard from '@/components/helpers/products/CreateProduct';
import { categoryApiService } from '@/lib/api/concrete/categories';
import React from 'react';

async function CreateProductPage() {
  const categories = await categoryApiService.getCategories();
  return (
    <div className='sticky top-0 bg-white z-10 px-4'>
      <BreadcrumbComponent
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Products', href: '/products/' },
          { label: 'Add', href: '/products/add' },
        ]}
      />

      <CreateProductCard categories={categories} />
    </div>
  );
}

export default CreateProductPage;
