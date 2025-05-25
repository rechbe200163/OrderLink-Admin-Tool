import CreateAddress from '@/components/helpers/addresses/CreateAddress';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import { useTranslations } from 'next-intl';

const AddAddressPage = () => {
  const t = useTranslations('Dashboard.Ressource');
  return (
    <div className='container mx-auto px-4 py-2'>
      <BreadcrumbComponent
        items={[
          { label: t('BreadCrumps.title'), href: '/' },
          { label: t('Address.BreadCrumps.title'), href: '/addresses/' },
          { label: t('Address.BreadCrumps.add'), href: '/addresses/add' },
        ]}
      />
      <CreateAddress />
    </div>
  );
};

export default AddAddressPage;
