import EditAddressForm from '@/components/forms/address/EditAddressForm';
import { addressApiService } from '@/lib/api/concrete/address';
import { fetchAddresses } from '@/dummyDataForStaticBuild';

interface EditAddressPageProps {
  params: Promise<{
    addressId: string;
  }>;
}

async function EditAddressPage(props: EditAddressPageProps) {
  const { addressId } = await props.params;
  const address = await addressApiService.getAddressById(addressId);
  return (
    <div className='container mx-auto px-4 py-2'>
      <EditAddressForm address={address} />
    </div>
  );
}

export default EditAddressPage;

export async function generateStaticParams() {
  const addresses = await fetchAddresses();
  return addresses.map((a) => ({ addressId: a.id }));
}
