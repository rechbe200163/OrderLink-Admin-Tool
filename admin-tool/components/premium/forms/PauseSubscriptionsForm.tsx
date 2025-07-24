'use client';
import { GenericLoading } from '@/components/loading-states/loading';
import { Button } from '@/components/ui/button';
import LoadingIcon from '@/components/loading-states/loading-icon';
import { pauseSubscription } from '@/lib/actions/subscription.actions';
import { PauseCircle } from 'lucide-react';

import React, { useActionState } from 'react';
import { toast } from 'sonner';

const PauseSubscriptionsForm = ({
  subId,
  siteConfigId,
}: {
  subId: string;
  siteConfigId: string;
}) => {
  const [formState, action, isPending] = useActionState(
    pauseSubscription.bind(null, subId, siteConfigId),
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
      <Button type='submit' variant={'secondary'} disabled={isPending}>
        {isPending ? (
          <>
            <LoadingIcon />
            <GenericLoading text='Pausing subscription...' />
          </>
        ) : (
          <>
            <PauseCircle className='mr-2 h-4 w-4' />
            Pause Subscription
          </>
        )}
      </Button>
    </form>
  );
};

export default PauseSubscriptionsForm;
