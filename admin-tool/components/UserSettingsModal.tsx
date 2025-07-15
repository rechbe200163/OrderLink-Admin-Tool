'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  updateProfile,
  requestPermissionAction,
} from '@/lib/actions/profile.actions';
import { useActionState } from 'react';
import CustomeToast from '@/components/helpers/toasts/CustomeErrorToast'; // Assuming this component exists
import { toast } from 'sonner';
import type { SanitizedEmployee } from '@/lib/utlis/getSession'; // Assuming these types exist

export default function UserSettingsModal({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SanitizedEmployee;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [profileState, updateAction, updating] = useActionState(updateProfile, {
    success: false,
    errors: { title: [] as string[] },
  });
  const [permState, permAction, requesting] = useActionState(
    requestPermissionAction,
    {
      success: false,
      errors: { title: [] as string[] },
    }
  );

  useEffect(() => {
    if (profileState.success) {
      toast.custom(() => (
        <CustomeToast
          variant='success'
          message='Profil erfolgreich aktualisiert'
        />
      ));
    } else if (profileState.errors?.title.length) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={profileState.errors!.title.join(', ')}
        />
      ));
    }
  }, [profileState]);

  useEffect(() => {
    if (permState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message='Anfrage gespeichert' />
      ));
    } else if (permState.errors?.title.length) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={permState.errors!.title.join(', ')}
        />
      ));
    }
  }, [permState]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-background p-6 space-y-6'>
        <DialogTitle className='text-2xl font-bold text-foreground'>
          Profil & Einstellungen
        </DialogTitle>
        <Tabs defaultValue='profile' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 h-10 rounded-md'>
            <TabsTrigger
              value='profile'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              Profil bearbeiten
            </TabsTrigger>
            <TabsTrigger
              value='access'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              Zugriff anfordern
            </TabsTrigger>
          </TabsList>
          <TabsContent value='profile' className='mt-4'>
            <form action={updateAction} className='space-y-4 pt-4'>
              <div className='grid gap-2'>
                <Label htmlFor='firstName'>Vorname</Label>
                <Input
                  id='firstName'
                  name='firstName'
                  required
                  defaultValue={user.firstName || ''}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='lastName'>Nachname</Label>
                <Input
                  id='lastName'
                  name='lastName'
                  required
                  defaultValue={user.lastName || ''}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email'>E-Mail-Adresse</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  defaultValue={user.email}
                  required
                />
              </div>
              {showPassword ? (
                <div className='space-y-2'>
                  <div className='grid gap-2'>
                    <Label htmlFor='currentPassword'>Aktuelles Passwort</Label>
                    <Input
                      id='currentPassword'
                      name='currentPassword'
                      type='password'
                      defaultValue='********'
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='newPassword'>Neues Passwort</Label>
                    <Input
                      id='newPassword'
                      name='newPassword'
                      type='password'
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='confirmPassword'>
                      Neues Passwort bestätigen
                    </Label>
                    <Input
                      id='confirmPassword'
                      name='confirmPassword'
                      type='password'
                    />
                  </div>
                </div>
              ) : (
                <Button
                  variant='outline'
                  type='button'
                  className='text-sm underline w-fit bg-transparent'
                  onClick={() => setShowPassword(true)}
                >
                  Passwort ändern
                </Button>
              )}
              <Button
                type='submit'
                disabled={updating}
                className='mt-4 w-full text-background'
              >
                Speichern
              </Button>
            </form>
          </TabsContent>
          <TabsContent value='access' className='mt-4'>
            <form action={permAction} className='space-y-4 pt-4'>
              <div className='space-y-2'>
                <Label className='text-base font-medium'>
                  Gewünschte Rechte
                </Label>
                <div className='space-y-2 ps-2'>
                  <label
                    htmlFor='products-checkbox'
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <Checkbox
                      id='products-checkbox'
                      name='roles'
                      value='PRODUCTS'
                    />{' '}
                    Produktverwaltung
                  </label>
                  <label
                    htmlFor='statistics-checkbox'
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <Checkbox
                      id='statistics-checkbox'
                      name='roles'
                      value='STATISTICS'
                    />{' '}
                    Statistikzugriff
                  </label>
                  <label
                    htmlFor='admin-checkbox'
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <Checkbox id='admin-checkbox' name='roles' value='ADMIN' />{' '}
                    Admin-Rechte
                  </label>
                </div>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='comment'>Kommentar (optional)</Label>
                <Input id='comment' name='comment' />
              </div>
              <Button
                type='submit'
                disabled={requesting}
                className='mt-2 w-full'
              >
                Anfrage senden
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
