import { AddressTable } from '@/components/helpers/addresses/AddressTable';
import FilteringComponent from '@/components/pagination+filtering/FilteringComponent';
import PaginationComponent from '@/components/pagination+filtering/PagingComponent';
import SearchComponent from '@/components/pagination+filtering/SearchComponent';
import TagsInput from '@/components/TagInput';
import { addressApiService } from '@/lib/api/concrete/address';
import { getSession } from '@/lib/utlis/getSession';
import { getTranslations } from 'next-intl/server';
import AddAddressDialog from '@/components/helpers/addresses/AddAddressDialog';
import { redirect } from 'next/navigation';

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
    <div className='px-5 pt-5'>
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

        <AddAddressDialog />
      </div>
      <div className='flex-1 justify-between gap-1 flex flex-col'>
        <div className='min-w-full max-h-[calc(100vh-15rem)] overflow-auto'>
          <AddressTable addresses={addresses} searchQuery={query} />
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
