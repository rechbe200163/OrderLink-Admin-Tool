'use client';
import React, { useActionState, useEffect } from 'react';
import { Button } from './ui/button';
import { createCheckoutPortalSession } from '@/lib/actions/subscription.actions';
import { useRouter } from 'next/navigation';

function PortalSessionButton() {
  const router = useRouter();
  const [formState, action, isPending] = useActionState(
    createCheckoutPortalSession,
    {
      success: false,
      errors: {
        title: [],
      },
    }
  );

  useEffect(() => {
    if (formState.success) {
      // Redirect to the billing portal
      router.push(formState.data.url);
    }
  }, [formState]);

  return (
    <form action={action}>
      <Button type='submit' disabled={isPending}>
        {isPending ? 'Loading...' : 'Open Billing Portal'}
      </Button>
    </form>
  );
}

export default PortalSessionButton;
