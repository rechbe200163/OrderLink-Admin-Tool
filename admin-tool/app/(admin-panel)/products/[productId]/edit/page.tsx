import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import EditProduct from '@/components/helpers/products/EditProduct';
import { categoryApiService } from '@/lib/api/concrete/categories';
import { productApiService } from '@/lib/api/concrete/products';
import { supabaseService } from '@/lib/utlis/SupabaseStorageService';
import React from 'react';
import { getTranslations } from 'next-intl/server';

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
  const t = await getTranslations('Dashboard.Ressource');
  return (
    <div className='sticky top-0 z-10 px-4 '>
      <BreadcrumbComponent
        items={[
          { label: t('BreadCrumps.title'), href: '/' },
          { label: t('Products.BreadCrumps.title'), href: '/products' },
          { label: t('Products.BreadCrumps.edit'), href: `/products/${product.productId}/edit` },
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
