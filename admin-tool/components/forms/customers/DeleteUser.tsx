'use client';
import { Button } from '@/components/ui/button';
import { deleteUser } from '@/lib/actions/user.actions';
import { Loader2, Trash2 } from 'lucide-react';
import React, { useActionState } from 'react';

const DeleteUser = ({ customerReference }: { customerReference: number }) => {
  const [formState, action, isPending] = useActionState(
    deleteUser.bind(null, customerReference),
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
        className={`flex items-center text-red-600 hover:text-red-700 ${
          isPending ? 'border border-red-600 bg-transparent' : ''
        }`}
      >
        {isPending ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Deleting
          </>
        ) : (
          <>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </>
        )}
      </Button>
      {formState.errors && formState.errors.title.length > 0 && (
        <div className='text-red-500 text-sm'>{formState.errors.title}</div>
      )}
    </form>
  );
};

export default DeleteUser;
