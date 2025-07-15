'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { updateProfile, requestPermissionAction } from '@/lib/actions/profile.actions';
import { useActionState } from 'react';
import { ModeToggle } from '@/components/dark-mode/Toggle';

export default function UserSettingsModal({ children }: { children: React.ReactNode }) {
  const [profileState, updateAction, updating] = useActionState(updateProfile, { success: false });
  const [permState, permAction, requesting] = useActionState(requestPermissionAction, { success: false });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='space-y-6'>
        <DialogTitle>Account Settings</DialogTitle>
        <form action={updateAction} className='space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='firstName'>First Name</Label>
            <Input id='firstName' name='firstName' />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='lastName'>Last Name</Label>
            <Input id='lastName' name='lastName' />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' type='email' />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' name='password' type='password' />
          </div>
          <Button type='submit' disabled={updating}>Save</Button>
        </form>
        <form action={permAction} className='space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='role'>Request Permission</Label>
            <Input id='role' name='role' placeholder='Role name' />
          </div>
          <Button type='submit' disabled={requesting}>Request</Button>
        </form>
        <div className='pt-4 border-t'>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
}
