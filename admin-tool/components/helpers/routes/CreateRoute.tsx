'use client';
import React, { useActionState, useId } from 'react';
import { toast } from 'sonner';
import CustomeToast from '../toasts/CustomeErrorToast';

import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import OrderSelectComponent from '../OrderSelectComponent';
import { createRoute } from '@/lib/actions/route.actions';
import { OrdersWithAddressOfCustomer } from '@/lib/types';
import { useTranslations } from 'next-intl';

interface CreateOrderProps {
  orders: OrdersWithAddressOfCustomer[];
}

const CreateRoutes = ({ orders }: CreateOrderProps) => {
  const t = useTranslations('Dashboard');
  const tSelect = useTranslations('SelectComponents.Route');
  const [selectOrder, setSelectedOrders] = React.useState<string[]>([]);
  const [formState, action, isPending] = useActionState(createRoute, {
    success: false,
    errors: {
      title: [''],
    },
  });

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message={t('Messages.Route.created')} />
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
    <Card className='shadow-md p-6 min-w-full'>
      <form action={action} className='space-y-6'>
        <h2 className='text-3xl font-bold tracking-tight mb-6'>
          {tSelect('addNewRoute')}
        </h2>
        <div className=''>
          <Label htmlFor={id}>{t('Ressource.Routes.name')}</Label>
          <Input id={id} name='name' />
        </div>
        <div className='space-y-2'>
          <OrderSelectComponent
            orders={orders}
            onOrderSelect={setSelectedOrders}
            defaultValues={selectOrder}
          />
          <input
            id='orderIds'
            name='orderIds'
            type='hidden'
            value={selectOrder}
          />
        </div>
        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <Loader2 className='animate-spin h-5 w-5' /> {tSelect('addNewRoute')}...
            </>
          ) : (
            <>
              <PlusCircle /> {tSelect('addNewRoute')}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default CreateRoutes;
