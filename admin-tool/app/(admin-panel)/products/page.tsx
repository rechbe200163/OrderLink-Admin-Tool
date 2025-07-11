import { PlusCircle } from 'lucide-react';
import React from 'react';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import { ProductTable } from '@/components/helpers/products/ProductsTabel';
import { productApiService } from '@/lib/api/concrete/products';
import { categoryApiService } from '@/lib/api/concrete/categories';
import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import { getSession } from '@/lib/utlis/getSession';
import { BusinessSector, Category } from '@/lib/types';

export default async function ProductsPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    query?: string;
    filter?: string;
    category?: BusinessSector;
  }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const query = searchParams?.query ? searchParams.query : '';
  const filter = searchParams?.filter ? searchParams.filter : '';
  const category = searchParams?.category;

  const productData = await productApiService.getProductsPaging(
    page,
    limit,
    query,
    filter,
    category
  );
  const products = productData.data;
  const { meta } = productData;
  const categories = await categoryApiService.getCategories();
  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-1'>
        <BreadcrumbComponent
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Products', href: '/products/' },
          ]}
        />
      </div>
      <div className='container'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex justify-between items-center space-x-4'>
            <SearchComponent placeholder={'Nach Name suchen'} />
            <FilteringComponent
              title='Status'
              filterName='filter'
              values={[
                { label: 'Archiviert', value: 'active', color: 'green' },
                { label: 'Aktiv', value: 'inactive', color: 'red' },
              ]}
            />
            <FilteringComponent
              title='Kategorien'
              filterName='category'
              values={categories.map((category: Category) => ({
                label: category.name,
                value: category.name,
              }))}
            />
          </div>

          <ButtonLinkComponent
            href='/products/add'
            label='Neues Produkt'
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
