import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import EditCustomerForm from '@/components/helpers/customers/EditCustomerForm';
import { addressApiService } from '@/lib/api/concrete/address';
import { customerApiService } from '@/lib/api/concrete/customers';
import { getTranslations } from 'next-intl/server';

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

  const t = await getTranslations('Dashboard');
  return (
    <div className='min-w-full p-5'>
      <BreadcrumbComponent
        items={[
          { label: t('Ressource.BreadCrumps.title'), href: '/' },
          {
            label: t('Ressource.Customers.BreadCrumps.title'),
            href: '/customers/',
          },
          {
            label: t('Ressource.Customers.BreadCrumps.edit'),
            href: `/customers/${customerReference}/edit`,
          },
        ]}
      />
      <EditCustomerForm customer={customer} addresses={addresses} />
    </div>
  );
}

export default EditCustomerPage;
