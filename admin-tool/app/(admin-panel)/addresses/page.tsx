import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import { AddressTable } from '@/components/helpers/addresses/AddressTable';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import TagsInput from '@/components/TagInput';
import { addressApiService } from '@/lib/api/concrete/address';
import { getSession } from '@/lib/utlis/getSession';
import { PlusCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function AddressesPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    query?: string;
    filter?: string;
    tag?: string;
  }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const query = searchParams?.query ? searchParams.query : '';
  const filter = searchParams?.filter ? searchParams.filter : '';
  const tag = searchParams?.tag ? searchParams.tag : '';

  const addressData = await addressApiService.getAddressesPaging(
    page,
    limit,
    query,
    filter,
    tag
  );
  const addresses = addressData.data;

  console.log('Addresses Data:', addresses);
  const { meta } = addressData;
  const t = await getTranslations('Dashboard');
  const tFilter = await getTranslations('FilterAndSearch');
  return (
    <div>
      <div className='sticky top-0 bg-background z-10 '></div>
      <div className='container '>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex justify-between items-center space-x-4'>
            <SearchComponent placeholder={tFilter('Search.searchForOption1')} />
            <TagsInput />
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
          </div>

          <ButtonLinkComponent
            href='/addresses/add'
            label={t('Ressource.Address.add')}
            icon={<PlusCircle size={24} />}
          />
        </div>
        <div className='bg-white rounded-lg shadow-md'>
          <AddressTable addresses={addresses} />
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
