'use client';
import GroupComponent from '@/components/GroupComponent';
import RadioGroupComponentUserTiers from '@/components/RadioGroupComponent';
import { Button } from '@/components/ui/button';
import { billingAction } from '@/lib/actions/billing.actions';
import { useActionState } from 'react';

const BillingPage = () => {
  const [formState, action, isPending] = useActionState(billingAction, {
    success: false,
    errors: {
      title: [],
    },
  });

  return (
    <div className='container mx-auto p-4'>
      <form action={action}>
        <RadioGroupComponentUserTiers />
        <GroupComponent />
        <Button type='submit' disabled={isPending}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default BillingPage;
