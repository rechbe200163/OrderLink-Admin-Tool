import EditAddressForm from '@/components/forms/address/EditAddressForm';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import { addressApiService } from '@/lib/api/concrete/address';
import { getTranslations } from 'next-intl/server';

interface EditAddressPageProps {
  params: Promise<{
    addressId: string;
  }>;
}

async function EditAddressPage(props: EditAddressPageProps) {
  const t = await getTranslations('Dashboard.Ressource');
  const { addressId } = await props.params;
  const address = await addressApiService.getAddressById(addressId);
  return (
    <div className='container mx-auto px-4 py-2'>
      <BreadcrumbComponent
        items={[
          { label: t('BreadCrumps.title'), href: '/' },
          { label: t('Address.BreadCrumps.title'), href: '/addresses/' },
          {
            label: t('Address.BreadCrumps.edit'),
            href: `/addresses/${addressId}/edit`,
          },
        ]}
      />
      <EditAddressForm address={address} />
    </div>
  );
}

export default EditAddressPage;
