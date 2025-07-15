'use client';
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
import { updateProfile, requestPermissionAction } from '@/lib/actions/profile.actions';
import { useActionState } from 'react';
import CustomeToast from '@/components/helpers/toasts/CustomeErrorToast';
import { toast } from 'sonner';

export default function UserSettingsModal({ children }: { children: React.ReactNode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [profileState, updateAction, updating] = useActionState(updateProfile, {
    success: false,
    errors: { title: [] as string[] },
  });
  const [permState, permAction, requesting] = useActionState(requestPermissionAction, {
    success: false,
    errors: { title: [] as string[] },
  });

  useEffect(() => {
    if (profileState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message='Profil erfolgreich aktualisiert' />
      ));
    } else if (profileState.errors?.title.length) {
      toast.custom(() => (
        <CustomeToast variant='error' message={profileState.errors!.title.join(', ')} />
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
        <CustomeToast variant='error' message={permState.errors!.title.join(', ')} />
      ));
    }
  }, [permState]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='space-y-6'>
        <DialogTitle>Profil & Einstellungen</DialogTitle>
        <Tabs defaultValue='profile'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='profile'>Profil bearbeiten</TabsTrigger>
            <TabsTrigger value='access'>Zugriff anfordern</TabsTrigger>
          </TabsList>
          <TabsContent value='profile'>
            <form action={updateAction} className='space-y-4 pt-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' name='name' required />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email'>E-Mail-Adresse</Label>
                <Input id='email' name='email' type='email' required />
              </div>
              {showPassword ? (
                <div className='space-y-2'>
                  <div className='grid gap-2'>
                    <Label htmlFor='currentPassword'>Aktuelles Passwort</Label>
                    <Input id='currentPassword' name='currentPassword' type='password' />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='newPassword'>Neues Passwort</Label>
                    <Input id='newPassword' name='newPassword' type='password' />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='confirmPassword'>Neues Passwort bestätigen</Label>
                    <Input id='confirmPassword' name='confirmPassword' type='password' />
                  </div>
                </div>
              ) : (
                <button
                  type='button'
                  className='text-sm underline'
                  onClick={() => setShowPassword(true)}
                >
                  Passwort ändern
                </button>
              )}
              <Button type='submit' disabled={updating} className='mt-4'>
                Speichern
              </Button>
            </form>
          </TabsContent>
          <TabsContent value='access'>
            <form action={permAction} className='space-y-4 pt-4'>
              <div className='space-y-2'>
                <Label>Gewünschte Rechte</Label>
                <div className='space-y-1 ps-2'>
                  <label className='flex items-center gap-2'>
                    <Checkbox name='roles' value='PRODUCTS' /> Produktverwaltung
                  </label>
                  <label className='flex items-center gap-2'>
                    <Checkbox name='roles' value='STATISTICS' /> Statistikzugriff
                  </label>
                  <label className='flex items-center gap-2'>
                    <Checkbox name='roles' value='ADMIN' /> Admin-Rechte
                  </label>
                </div>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='comment'>Kommentar (optional)</Label>
                <Input id='comment' name='comment' />
              </div>
              <Button type='submit' disabled={requesting} className='mt-2'>
                Anfrage senden
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
