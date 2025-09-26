import GenericAddForm from '@/components/forms/GenericAddForm';
import { GenericLoading } from '@/components/loading-states/loading';
import { Suspense } from 'react';
export default async function AddUserPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <Suspense fallback={<GenericLoading />}>
        <GenericAddForm />
      </Suspense>
    </div>
  );
}
