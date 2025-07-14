import GenericAddForm from '@/components/forms/GenericAddForm';
import { addressApiService } from '@/lib/api/concrete/address';
import { Suspense } from 'react';
export default async function AddUserPage() {
  const addresses = await addressApiService.getAddresses();
  return (
    <div className='container mx-auto'>
      <Suspense fallback={<div>Loading...</div>}>
        <GenericAddForm addresses={addresses} />
      </Suspense>
    </div>
  );
}
