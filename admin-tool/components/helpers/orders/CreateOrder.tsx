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
import { useOrderStore } from '@/lib/stores/useOrderStore';

const CreateOrder = () => {
  const selectedCustomer = useOrderStore(
    (s) => s.order.customerReference
  );
  const selectedProducts = useOrderStore((s) => s.order.selectedProducts);
  const selectedProductObjects = useOrderStore(
    (s) => s.order.selectedProductObjects
  );
  const quantities = useOrderStore((s) => s.order.quantities);
  const selfCollect = useOrderStore((s) => s.order.selfCollect);

  const setCustomer = useOrderStore((s) => s.setCustomerReference);
  const addProduct = useOrderStore((s) => s.addProduct);
  const removeProduct = useOrderStore((s) => s.removeProduct);
  const setQuantity = useOrderStore((s) => s.setQuantity);
  const setSelfCollect = useOrderStore((s) => s.setSelfCollect);
  const reset = useOrderStore((s) => s.reset);
  const [formState, action, isPending] = useActionState(createOrder, {
    success: false,
    errors: {
      title: [''],
    },
  });

  const stockOfSelectedProducts = selectedProductObjects;

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message='Order created successfully!' />
      ));
      reset();
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
  }, [formState, reset]);

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
            checked={selfCollect}
            onCheckedChange={(v) => setSelfCollect(Boolean(v))}
            className='h-5 w-5'
          />
        </div>
        <div className='space-y-2'>
          <CustomerSelectComponent
            onCustomerSelect={setCustomer}
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
            onProductSelect={(product: Product, isSelected: boolean) => {
              if (isSelected) {
                addProduct(product);
              } else {
                removeProduct(product.productId);
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
                    setQuantity(product.productId, Number(e.target.value))
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
