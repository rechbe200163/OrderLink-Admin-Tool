import { PlusCircle } from 'lucide-react';
import React from 'react';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import { ProductTable } from '@/components/helpers/products/ProductsTabel';
import { productApiService } from '@/lib/api/concrete/products';
import { categoryApiService } from '@/lib/api/concrete/categories';
import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import { getSession } from '@/lib/utlis/getSession';
import { BusinessSector, Category } from '@/lib/types';
import { getTranslations } from 'next-intl/server';

export default async function ProductsPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    filter?: string;
    category?: BusinessSector;
  }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const search = searchParams?.search ? searchParams.search : '';
  const filter = searchParams?.filter ? searchParams.filter : '';
  const category = searchParams?.category;

  const productData = await productApiService.getProductsPaging(
    page,
    limit,
    search,
    filter,
    category
  );
  const products = productData.data;
  const { meta } = productData;
  const categories = await categoryApiService.getCategories();
  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');
  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-1'></div>
      <div className='container'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex justify-between items-center space-x-4'>
            <SearchComponent placeholder={tFilter('Search.searchForOption1')} />
            <FilteringComponent
              title={tFilter('Filter.Status.title')}
              filterName='filter'
              values={[
                {
                  label: tFilter('Filter.Status.options.active'),
                  value: 'active',
                  color: 'green',
                },
                {
                  label: tFilter('Filter.Status.options.inactive'),
                  value: 'inactive',
                  color: 'red',
                },
              ]}
            />
            <FilteringComponent
              title={t('Ressource.Categories.BreadCrumps.title')}
              filterName='category'
              values={categories.map((category: Category) => ({
                label: category.name,
                value: category.name,
              }))}
            />
          </div>

          <ButtonLinkComponent
            href='/products/add'
            label={t('Ressource.Products.add')}
            icon={<PlusCircle />}
          />
        </div>
        <div className='bg-white rounded-lg shadow-md'>
          <ProductTable products={products} />
        </div>
        <div className='mt-4 mb-5'>
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
