import EditOrder from '@/components/helpers/orders/EditOrder';
import { orderApiService } from '@/lib/api/concrete/orders';
import { productApiService } from '@/lib/api/concrete/products';
import React from 'react';
interface EditOrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}
async function EditOrderPage(props: EditOrderPageProps) {
  const { orderId } = await props.params;
  const products = await productApiService.getAll();
  const order = await orderApiService.getOrderById(orderId);
  return (
    <div className='min-w-full p-5'>
      <EditOrder products={products} order={order} />
    </div>
  );
}

export default EditOrderPage;
