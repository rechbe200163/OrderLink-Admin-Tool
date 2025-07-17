import CreateProductCard from '@/components/helpers/products/CreateProduct';
import React from 'react';

async function CreateProductPage() {
  return (
    <div className='sticky top-0 z-10 px-4'>

      <CreateProductCard />
    </div>
  );
}

export default CreateProductPage;
