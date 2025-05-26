import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import EditProduct from '@/components/helpers/products/EditProduct';
import { categoryApiService } from '@/lib/api/concrete/categories';
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
  const singedProductImageUrl = await supabaseService.getSingedUrlSupabase(
    product.imagePath!
  );
  const categories = await categoryApiService.getCategories();
  return (
    <div className='sticky top-0 bg-white z-10 px-4 bg-background'>
      <BreadcrumbComponent
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Produkte', href: '/products' },
          { label: 'Bearbeiten', href: `/products/${product.productId}/edit` },
        ]}
      />
      <EditProduct
        product={product}
        categories={categories}
        signedImageUrl={singedProductImageUrl!}
      />
    </div>
  );
}

export default EditProductPage;
