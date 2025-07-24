import EditProduct from '@/components/helpers/products/EditProduct';
import { productApiService } from '@/lib/api/concrete/products';
import { supabaseService } from '@/lib/utlis/SupabaseStorageService';
import React from 'react';

interface EditProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

async function EditProductPage(props: EditProductPageProps) {
  const { productId } = await props.params;
  const product = await productApiService.getProductbyId(productId);
  return (
    <div className='sticky top-0 z-10 px-4 '>
      <EditProduct product={product} />
    </div>
  );
}

export default EditProductPage;
