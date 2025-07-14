import EditCustomerForm from '@/components/helpers/customers/EditCustomerForm';
import { addressApiService } from '@/lib/api/concrete/address';
import { customerApiService } from '@/lib/api/concrete/customers';

interface EditCustomerPageProps {
  params: Promise<{
    customerReference: string;
  }>;
}

async function EditCustomerPage(props: EditCustomerPageProps) {
  const { customerReference } = await props.params;
  const customer =
    await customerApiService.getCustomerByReference(customerReference);
  const addresses = await addressApiService.getAddresses();

  console.log('Customer data:', customer);
  console.log('Addresses data:', addresses);

  return (
    <div className='min-w-full p-5'>
      <EditCustomerForm customer={customer} addresses={addresses} />
    </div>
  );
}

export default EditCustomerPage;
