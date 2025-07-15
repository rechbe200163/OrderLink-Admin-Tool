'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useActionState } from 'react';
import { updateCurrentUser } from '@/lib/actions/user.actions';
import { requestPermission } from '@/lib/actions/permission.actions';
import { Session } from '@/lib/utlis/getSession';
import { toast } from 'sonner';

export default function EditProfileModal({ session }: { session: Session }) {
  const [formState, action, isPending] = useActionState(updateCurrentUser, {
    success: false,
    errors: { title: [''] },
  });

  useEffect(() => {
    if (formState.success) {
      toast.success('Profile updated');
    } else if (formState.errors?.title[0]) {
      toast.error(formState.errors.title.join(', '));
    }
  }, [formState]);

  const user = session.user;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem asChild>
          <button className='w-full text-left'>Edit Profile</button>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form action={action} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='firstName'>First Name</Label>
              <Input id='firstName' name='firstName' defaultValue={user.firstName} />
            </div>
            <div>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input id='lastName' name='lastName' defaultValue={user.lastName} />
            </div>
          </div>
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' type='email' defaultValue={user.email} />
          </div>
          <div>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' name='password' type='password' />
          </div>
          <DialogFooter className='sm:justify-between'>
            <Button
              type='submit'
              variant='secondary'
              formAction={requestPermission}
            >
              Request Permission
            </Button>
            <Button type='submit' disabled={isPending} formAction={action}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
