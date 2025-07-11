'use client';
import React, { useActionState, useId } from 'react';
import { toast } from 'sonner';
import CustomeToast from '../toasts/CustomeErrorToast';

import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CustomerSelectComponent from '../CustomerSelectCompoent';
import ProductSelectComponent from '../ProductSelectCompoent';
import { Checkbox } from '@/components/ui/checkbox';
import { createOrder } from '@/lib/actions/order.actions';
import { Customer, Product } from '@/lib/types';

interface CreateOrderProps {
  customer: Customer[];
  products: Product[];
}

const CreateOrder = ({ customer, products }: CreateOrderProps) => {
  const [selectedCustomer, setSelectedCustomer] = React.useState<string>('');
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [formState, action, isPending] = useActionState(createOrder, {
    success: false,
    errors: {
      title: [''],
    },
  });

  const stockOfSelectedProducts = selectedProducts.map((productId) =>
    products.find((product) => product.productId === productId)
  );

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message='Order created successfully!' />
      ));
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
  }, [formState]);

  const id = useId();
  return (
    <Card className='shadow-md p-6 min-w-full '>
      <form action={action} className='space-y-6'>
        <h2 className='text-3xl font-bold tracking-tight mb-6'>
          Add New Order
        </h2>
        <div className='flex items-center gap-2'>
          <Label htmlFor={id}>Self Collect</Label>
          <Checkbox
            id={id}
            name='selfCollect'
            defaultChecked={false}
            className='h-5 w-5'
          />
        </div>
        <div className='space-y-2'>
          <CustomerSelectComponent
            customers={customer}
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
            products={products}
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
                />
              </div>
            ) : null
          )}
        </div>
        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <Loader2 className='animate-spin h-5 w-5' /> Adding Order
            </>
          ) : (
            <>
              <PlusCircle /> Add Order
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default CreateOrder;
