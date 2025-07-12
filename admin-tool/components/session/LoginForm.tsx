'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useState } from 'react';
import { EyeIcon, EyeOff, Loader2Icon, LockKeyhole } from 'lucide-react';
import { logIn } from '@/lib/actions/auth.actions';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [inputHidden, setInputHidden] = useState('password');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [_formState, action, isLoading] = useActionState(logIn, {
    success: false,
    errors: { title: [] as string[] },
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Willkommen zurück</CardTitle>
          <CardDescription>
            Willkommen im Admin-Bereich. Bitte melde dich an, um fortzufahren.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className='grid gap-6'>
              <div className='grid gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>E-Mail</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='m@example.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='grid gap-2'>
                  <div className='flex items-center'>
                    <Label htmlFor='password'>Passwort</Label>
                    <a
                      href='#'
                      className='ml-auto text-sm underline-offset-4 hover:underline'
                    >
                      Passwort vergessen?
                    </a>
                  </div>
                  <div className='relative'>
                    <Input
                      id='password'
                      name='password'
                      type={inputHidden}
                      required
                      className='pr-10'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setInputHidden(
                          inputHidden === 'password' ? 'text' : 'password'
                        )
                      }
                      className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700'
                      tabIndex={-1}
                      aria-label={
                        inputHidden === 'password'
                          ? 'Passwort anzeigen'
                          : 'Passwort verbergen'
                      }
                    >
                      {inputHidden === 'password' ? (
                        // Eye closed icon
                        <EyeOff className='h-5 w-5' />
                      ) : (
                        // Eye open icon
                        <EyeIcon className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                </div>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                      Anmelden...
                    </>
                  ) : (
                    <>
                      Anmelden
                      <LockKeyhole className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
