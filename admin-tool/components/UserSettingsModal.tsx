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
import CustomeToast from '@/components/helpers/toasts/CustomeErrorToast';
import { toast } from 'sonner';
import type { SanitizedEmployee } from '@/lib/utlis/getSession';

export default function UserSettingsModal({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SanitizedEmployee;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [profileState, updateAction, updating] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (showPassword && password !== confirmPassword) {
        setPasswordError('Passwörter stimmen nicht überein.');
        return {
          success: false,
          errors: { title: ['Passwörter stimmen nicht überein.'] },
        };
      }

      // Inject password manually if field was added
      if (showPassword && password) {
        formData.set('password', password);
      }

      return await updateProfile(user, prevState, formData);
    },
    {
      success: false,
      errors: { title: [] as string[] },
    }
  );

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
          message={
            profileState.errors?.title.join(', ') ||
            'Fehler beim Aktualisieren des Profils'
          }
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
          message={
            permState.errors?.title.join(', ') ||
            'Fehler beim Speichern der Anfrage'
          }
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

        <div className='text-sm text-muted-foreground mb-2'>
          Änderungen an Name und Email werden erst nach erneutem Aus- und
          Einloggen wirksam.
        </div>

        {/* <div className='mb-4 p-3 rounded-md bg-yellow-100 text-yellow-800 text-sm border border-yellow-300'>
          Falls Sie sich zum Erstenmal angemeldet haben empfehlen wir Ihnen
          dringend Ihr Passwort zu ändern.
        </div> */}

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
                  defaultValue={user.firstName}
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='lastName'>Nachname</Label>
                <Input
                  id='lastName'
                  name='lastName'
                  required
                  defaultValue={user.lastName}
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='email'>E-Mail-Adresse</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  required
                  defaultValue={user.email}
                />
              </div>

              {showPassword ? (
                <div className='space-y-2'>
                  <div className='grid gap-2'>
                    <Label htmlFor='password'>Neues Passwort</Label>
                    <Input
                      id='password'
                      name='password'
                      type='password'
                      value={password}
                      onChange={(e) => {
                        setpassword(e.target.value);
                        setPasswordError('');
                      }}
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='confirmPassword'>Passwort bestätigen</Label>
                    <Input
                      id='confirmPassword'
                      type='password'
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError('');
                      }}
                    />
                  </div>

                  {passwordError && (
                    <div className='text-sm text-destructive'>
                      {passwordError}
                    </div>
                  )}
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
                  {[
                    {
                      id: 'products-checkbox',
                      value: 'PRODUCTS',
                      label: 'Produktverwaltung',
                    },
                    {
                      id: 'statistics-checkbox',
                      value: 'STATISTICS',
                      label: 'Statistikzugriff',
                    },
                    {
                      id: 'admin-checkbox',
                      value: 'ADMIN',
                      label: 'Admin-Rechte',
                    },
                  ].map(({ id, value, label }) => (
                    <label
                      key={id}
                      htmlFor={id}
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <Checkbox id={id} name='roles' value={value} /> {label}
                    </label>
                  ))}
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
