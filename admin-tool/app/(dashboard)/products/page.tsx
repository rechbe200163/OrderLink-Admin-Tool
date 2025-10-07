import { PlusCircle } from 'lucide-react';
import React from 'react';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import { ProductTable } from '@/components/helpers/products/ProductsTabel';
import { productApiService } from '@/lib/api/concrete/products';
import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import { getSession } from '@/lib/utlis/getSession';
import { BusinessSector } from '@/lib/types';
import { getTranslations } from 'next-intl/server';

export default async function ProductsPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    categoryId?: BusinessSector;
  }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const search = searchParams?.search ? searchParams.search : '';
  const categoryId = searchParams?.categoryId;

  const productData = await productApiService.getProductsPaging(
    page,
    limit,
    search,
    categoryId
  );
  const products = productData.data;
  console.log('products1', products);
  const { meta } = productData;
  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');
  return (
    <div className='px-5 pt-5'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex justify-between items-center space-x-4'>
          <SearchComponent placeholder={tFilter('Search.searchForOption1')} />
          <FilteringComponent
            title={t('Ressource.Categories.BreadCrumps.title')}
            filterName='categoryId'
            endpoint='CATEGORIES'
          />
        </div>

        <ButtonLinkComponent
          href='/products/add'
          label={t('Ressource.Products.add')}
          icon={<PlusCircle />}
        />
      </div>
      <div className='flex-1 justify-between gap-1 flex flex-col'>
        <div className='min-w-full max-h-[calc(100vh-15rem)] overflow-auto'>
          <ProductTable products={products} />
        </div>
        <div>
          <PaginationComponent
            currentPage={meta.currentPage}
            totalPages={meta.pageCount}
            totalValues={meta.totalCount}
          />
        </div>
      </div>
    </div>
  );
}
