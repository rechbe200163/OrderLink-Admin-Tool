'use client';

import { useId, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CustomerSelectComponent from '../CustomerSelectCompoent';
import ProductSelectComponent from '../ProductSelectCompoent';
import { Checkbox } from '@/components/ui/checkbox';
import { createOrder } from '@/lib/actions/order.actions';
import { Product } from '@/lib/types';
import { useOrderStore } from '@/lib/stores/useOrderStore';
import { PlusCircle } from 'lucide-react';
import { GenericDialogForm } from '@/components/forms/generic';
import { useTranslations } from 'next-intl';

const AddOrderDialog = () => {
  const t = useTranslations('Dashboard.Ressource.Orders');
  const selectedCustomer = useOrderStore((s) => s.order.customerReference);
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

  const stockOfSelectedProducts = selectedProductObjects;
  const id = useId();

  // Hydrate the store on mount to prevent SSR hydration issues
  useEffect(() => {
    useOrderStore.persist.rehydrate();
  }, []);

  return (
    <GenericDialogForm
      triggerButtonText={t('add')}
      triggerButtonIcon={<PlusCircle className='h-4 w-4' />}
      dialogTitle={t('add')}
      dialogDescription={t('dialogDescription')}
      serverAction={createOrder}
      submitButtonText={t('buttons.add')}
      submitButtonPendingText={t('buttons.addLoading')}
      formClassName='space-y-4 max-h-[60vh] overflow-y-auto'
    >
      {(formState, isPending) => (
        <>
          <div className='flex items-center gap-2'>
            <Label htmlFor={id}>{t('Attributes.selfCollectYes')}</Label>
            <Checkbox
              id={id}
              name='selfCollect'
              checked={selfCollect}
              onCheckedChange={(v) => setSelfCollect(Boolean(v))}
              className='h-5 w-5'
              disabled={isPending}
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
                    {t('Attributes.Products.quantity')} for {product.name}
                  </Label>
                  <Input
                    id={`quantity-${product.productId}`}
                    type='number'
                    placeholder={`${t('Attributes.Products.quantity')} (max: ${product.stock})`}
                    required
                    min='1'
                    max={product.stock}
                    onChange={(e) =>
                      setQuantity(product.productId, Number(e.target.value))
                    }
                    disabled={isPending}
                  />
                </div>
              ) : null
            )}
          </div>
        </>
      )}
    </GenericDialogForm>
  );
};

export default AddOrderDialog;
