import EditAddressForm from '@/components/forms/address/EditAddressForm';
import { addressApiService } from '@/lib/api/concrete/address';

interface EditAddressPageProps {
  params: Promise<{
    addressId: string;
  }>;
}

async function EditAddressPage(props: EditAddressPageProps) {
  const { addressId } = await props.params;
  const address = await addressApiService.getAddressById(addressId);
  return (
    <div className='container mx-auto'>
      <EditAddressForm address={address} />
    </div>
  );
}

export default EditAddressPage;
