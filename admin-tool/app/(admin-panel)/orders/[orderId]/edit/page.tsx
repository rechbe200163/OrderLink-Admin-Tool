import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import EditOrder from '@/components/helpers/orders/EditOrder';
import { customerApiService } from '@/lib/api/concrete/customers';
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
  const customers = await customerApiService.getAll();
  const products = await productApiService.getAll();
  const order = await orderApiService.getOrderById(orderId);
  return (
    <div className='min-w-full p-5'>
      <BreadcrumbComponent
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Orders', href: '/orders' },
          { label: 'Edit', href: `/orders/${order.orderId}/edit` },
        ]}
      />
      <EditOrder customer={customers} products={products} order={order} />
    </div>
  );
}

export default EditOrderPage;
