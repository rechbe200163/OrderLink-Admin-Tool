import GenericAddForm from '@/components/forms/GenericAddForm';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import { addressApiService } from '@/lib/api/concrete/address';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
export default async function AddUserPage() {
  const addresses = await addressApiService.getAddresses();
  const t = await getTranslations('Dashboard');
  return (
    <div className='container mx-auto px-4 py-8'>
      <BreadcrumbComponent
        items={[
          { label: t('Ressource.BreadCrumps.title'), href: '/' },
          {
            label: t('Ressource.Customers.BreadCrumps.title'),
            href: '/customers/',
          },
          { label: t('Ressource.Customers.BreadCrumps.add') },
        ]}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <GenericAddForm addresses={addresses} />
      </Suspense>
    </div>
  );
}
