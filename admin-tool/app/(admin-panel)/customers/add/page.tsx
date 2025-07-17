import GenericAddForm from '@/components/forms/GenericAddForm';
import { Suspense } from 'react';
export default async function AddUserPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <Suspense fallback={<div>Loading...</div>}>
        <GenericAddForm />
      </Suspense>
    </div>
  );
}
