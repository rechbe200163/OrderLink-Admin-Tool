import React, { useActionState } from 'react';
import { Button } from './ui/button';
import { createCheckoutPortalSession } from '@/lib/actions/subscription.actions';

function PortalSessionButton() {
  const [formState, action, isPending] = useActionState(
    createCheckoutPortalSession,
    {
      success: false,
      errors: {
        title: [],
      },
    }
  );

  return (
    <form action={action}>
      <Button type='submit' disabled={isPending}>
        {isPending ? 'Loading...' : 'Open Billing Portal'}
      </Button>
    </form>
  );
}

export default PortalSessionButton;
