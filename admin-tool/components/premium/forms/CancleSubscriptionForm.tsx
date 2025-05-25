'use client';
import { Button } from '@/components/ui/button';
import { cancleSubscription } from '@/lib/actions/subscription.actions';
import { CircleX, Loader2 } from 'lucide-react';

import React, { useActionState } from 'react';
import { toast } from 'sonner';

const CancleSubscriptionForm = ({
  subId,
  siteConfigId,
}: {
  subId: string;
  siteConfigId: string;
}) => {
  const [formState, action, isPending] = useActionState(
    cancleSubscription.bind(null, subId, siteConfigId),
    {
      success: false,
      errors: {
        title: [''],
      },
    }
  );

  React.useEffect(() => {
    if (formState.success) {
      toast.success('Subscription paused successfully!');
    } else if (formState.errors?.title[0]) {
      toast.error(`Failed to pause subscription: ${formState.errors.title[0]}`);
    }
  }, [formState]);

  return (
    <form action={action}>
      <Button type='submit' variant={'destructive'} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Canceling...
          </>
        ) : (
          <>
            <CircleX className='mr-2 h-4 w-4' />
            Cancel Subscription
          </>
        )}
      </Button>
    </form>
  );
};

export default CancleSubscriptionForm;
