import CreateOrder from '@/components/helpers/orders/CreateOrder';
import React from 'react';

async function CreateOrdersPage() {
  return (
    <div className='min-w-full p-5'>
      <CreateOrder />
    </div>
  );
}

export default CreateOrdersPage;
