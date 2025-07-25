'use client';
import React, { useActionState, useId } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Checkbox } from '@/components/ui/checkbox';
import CustomeToast from '@/components/helpers/toasts/CustomeErrorToast';
import CustomerSelectComponent from '@/components/helpers/CustomerSelectCompoent';
import ProductSelectComponent from '@/components/helpers/ProductSelectCompoent';
import { OrdersWithCustomerAndProducts, Product } from '@/lib/types';
import { updateOrder } from '@/lib/actions/order.actions';
import { useRouter } from 'next/navigation';
import LoadingIcon from '@/components/loading-states/loading-icon';
interface EditOrderProps {
  products: Product[];
  order: OrdersWithCustomerAndProducts;
}

const EditOrder = ({ products, order }: EditOrderProps) => {
  const [selectedCustomer, setSelectedCustomer] = React.useState<string>(
    String(order.customerReference)
  );
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>(
    order.products.map((product) => product.productId)
  );
  const router = useRouter();

  const [formState, action, isPending] = useActionState(
    updateOrder.bind(null, order.orderId, order),
    {
      success: false,
      errors: {
        title: [''],
      },
    }
  );

  const stockOfSelectedProducts = selectedProducts.map((productId) =>
    products.find((product) => product.productId === productId)
  );

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message='Order created successfully!' />
      ));
      if (formState.data) {
        router.push(`/orders/${formState.data}/edit`);
      }
    } else if (formState.errors?.title[0]) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={`An error occurred: ${
            formState.errors?.title?.join(', ') ?? ''
          }`}
        />
      ));
    }
  }, [formState, router]);

  const id = useId();
  return (
    <Card className='shadow-md p-6 min-w-full'>
      <form action={action} className='space-y-6'>
        <h2 className='text-3xl font-bold tracking-tight mb-6'>
          Add New Order
        </h2>
        <div className='flex items-center gap-2'>
          <Label htmlFor={id}>Self Collect</Label>
          <Checkbox
            id={id}
            name='selfCollect'
            defaultChecked={order.selfCollect || false}
            className='h-5 w-5'
          />
        </div>
        <div className='space-y-2'>
          <CustomerSelectComponent
            onCustomerSelect={setSelectedCustomer}
            defaultValue={selectedCustomer}
          />
          <input
            id='customerReference'
            name='customerReference'
            type='hidden'
            value={selectedCustomer}
          />
        </div>
        <div className='space-y-2'>
          <ProductSelectComponent
            onProductSelect={(productId) => {
              if (selectedProducts.includes(productId)) {
                setSelectedProducts(
                  selectedProducts.filter((id) => id !== productId)
                );
              } else {
                setSelectedProducts([...selectedProducts, productId]);
              }
            }}
            defaultValue={selectedProducts}
          />
          <input
            id='productIds'
            name='productIds'
            type='hidden'
            value={selectedProducts.join(',')}
          />
        </div>
        <div className='space-y-2 min-w-full'>
          {stockOfSelectedProducts.map((product, _index) =>
            product ? (
              <div key={product.productId} className='space-y-2'>
                <Label htmlFor={`quantity-${product.productId}`}>
                  Quantity for {product.name}
                </Label>
                <Input
                  id={`quantity-${product.productId}`}
                  name={`quantity-${product.productId}`}
                  type='number'
                  placeholder={`Maximum quantity: ${product.stock}`}
                  required
                  min='1'
                  max={product.stock}
                  defaultValue={
                    order.products.find(
                      (orderProduct) =>
                        orderProduct.productId === product.productId
                    )?.productAmount
                  }
                />
              </div>
            ) : null
          )}
        </div>
        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <LoadingIcon /> Updating Order
            </>
          ) : (
            <>
              <PlusCircle /> Update Order
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default EditOrder;
