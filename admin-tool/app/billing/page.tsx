'use client';
import GroupComponent from '@/components/GroupComponent';
import RadioGroupComponentUserTiers from '@/components/RadioGroupComponent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { billingAction } from '@/lib/actions/billing.actions';
import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

const BillingPage = () => {
  const t = useTranslations('Components.NavUser');
  const [formState, action, isPending] = useActionState(billingAction, {
    success: false,
    errors: {
      title: [],
    },
  });

  return (
    <div className='flex min-h-svh items-center justify-center bg-muted p-6 md:p-10'>
      <Card className='w-full max-w-xl space-y-6 p-6'>
        <h1 className='text-3xl font-bold'>{t('billing')}</h1>
        <form action={action} className='space-y-6'>
          <RadioGroupComponentUserTiers />
          <GroupComponent />
          <Button type='submit' disabled={isPending} className='w-full'>
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BillingPage;
