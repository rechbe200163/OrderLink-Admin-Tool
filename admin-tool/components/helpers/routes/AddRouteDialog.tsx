'use client';

import React, { useId, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import OrderSelectComponent from '../OrderSelectComponent';
import { createRoute } from '@/lib/actions/route.actions';
import { useTranslations } from 'next-intl';
import { PlusCircle } from 'lucide-react';
import { GenericDialogForm } from '@/components/forms/generic';

const AddRouteDialog = () => {
  const t = useTranslations('Dashboard');
  const tSelect = useTranslations('SelectComponents.Route');
  const [selectOrder, setSelectedOrders] = useState<string[]>([]);
  const id = useId();

  return (
    <GenericDialogForm
      triggerButtonText={tSelect('addNewRoute')}
      triggerButtonIcon={<PlusCircle className='h-4 w-4' />}
      dialogTitle={tSelect('addNewRoute')}
      dialogDescription={t('Ressource.Routes.dialogDescription')}
      serverAction={createRoute}
      submitButtonText={tSelect('addNewRoute')}
      submitButtonPendingText={tSelect('addNewRouteLoading')}
    >
      {(formState, isPending) => (
        <>
          <div className='space-y-2'>
            <Label htmlFor={id}>{t('Ressource.Routes.name')}</Label>
            <Input 
              id={id} 
              name='name' 
              disabled={isPending}
              required
            />
          </div>
          <div className='space-y-2'>
            <OrderSelectComponent
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
        </>
      )}
    </GenericDialogForm>
  );
};

export default AddRouteDialog;
