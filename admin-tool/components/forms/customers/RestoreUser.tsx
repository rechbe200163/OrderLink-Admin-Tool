'use client';
import { GenericLoading } from '@/components/loading-states/loading';
import { Button } from '@/components/ui/button';
import LoadingIcon from '@/components/loading-states/loading-icon';
import { restoreUser } from '@/lib/actions/user.actions';
import { RotateCcw } from 'lucide-react';
import React, { useActionState } from 'react';

const RestoreUser = ({ customerReference }: { customerReference: number }) => {
  const [formState, action, isPending] = useActionState(
    restoreUser.bind(null, customerReference),
    {
      success: false,
      errors: {
        title: [''],
      },
    }
  );
  return (
    <form action={action} className='space-y-4'>
      <Button
        type='submit'
        disabled={isPending}
        variant='outline'
        size='sm'
        className={`flex items-center ${
          isPending ? 'border border-blue-500 bg-transparent' : ''
        }`}
      >
        {isPending ? (
          <>
            <LoadingIcon />
            <GenericLoading text='Restoring user...' />
          </>
        ) : (
          <>
            <RotateCcw className='h-4 w-4 mr-2' /> Restore
          </>
        )}
      </Button>
      {formState.errors && formState.errors.title.length > 0 && (
        <div className='text-red-500 text-sm'>{formState.errors.title}</div>
      )}
    </form>
  );
};

export default RestoreUser;
