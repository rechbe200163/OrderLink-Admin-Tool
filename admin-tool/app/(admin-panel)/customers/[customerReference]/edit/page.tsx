import EditCustomerForm from '@/components/helpers/customers/EditCustomerForm';
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

  console.log('Customer data:', customer);

  return (
    <div className='min-w-full p-5'>
      <EditCustomerForm customer={customer} />
    </div>
  );
}

export default EditCustomerPage;
