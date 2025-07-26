'use client';
import React, { useActionState, useId } from 'react';
import { toast } from 'sonner';
import CustomeToast from '../toasts/CustomeErrorToast';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CustomerSelectComponent from '../CustomerSelectCompoent';
import ProductSelectComponent from '../ProductSelectCompoent';
import { Checkbox } from '@/components/ui/checkbox';
import { createOrder } from '@/lib/actions/order.actions';
import { Product } from '@/lib/types';
import LoadingIcon from '@/components/loading-states/loading-icon';
import { GenericLoading } from '@/components/loading-states/loading';

const CreateOrder = () => {
  const [selectedCustomer, setSelectedCustomer] = React.useState<string>('');
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [quantities, setQuantities] = React.useState<Record<string, number>>(
    {}
  );
  const [selectedProductObjects, setSelectedProductObjects] = React.useState<
    Product[]
  >([]);
  const [formState, action, isPending] = useActionState(createOrder, {
    success: false,
    errors: {
      title: [''],
    },
  });

  const stockOfSelectedProducts = selectedProductObjects;

  console.log('Selected Products:', stockOfSelectedProducts);

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
            onProductSelect={(product, isSelected) => {
              if (isSelected) {
                setSelectedProducts((prev) => [...prev, product.productId]);
                setSelectedProductObjects((prev) => [...prev, product]);
              } else {
                setSelectedProducts([...selectedProducts, product.productId]);
                setQuantities((q) => ({ ...q, [product.productId]: 1 }));
              }
            }}
            defaultValue={selectedProducts}
          />
          <input
            id='products'
            name='products'
            type='hidden'
            value={JSON.stringify(
              selectedProducts.map((id) => ({
                productId: id,
                productAmount: quantities[id] || 1,
              }))
            )}
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
                  type='number'
                  placeholder={`Maximum quantity: ${product.stock}`}
                  required
                  min='1'
                  max={product.stock}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [product.productId]: Number(e.target.value),
                    })
                  }
                />
              </div>
            ) : null
          )}
        </div>
        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <LoadingIcon />
              <GenericLoading text='Creating order...' />
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
