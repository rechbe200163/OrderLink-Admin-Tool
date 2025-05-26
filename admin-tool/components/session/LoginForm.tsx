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
import { useState } from 'react';
import { EyeIcon, EyeOff, Loader2Icon, LockKeyhole } from 'lucide-react';
import { signIn } from 'next-auth/react';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [inputHidden, setInputHidden] = useState('password');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    if (!email || !password) {
      console.error('Email and password are required');
      return;
    }
    e.preventDefault();
    setLoading(true);
    try {
      await signIn('credentials', {
        redirect: true,
        email,
        password,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
          <form>
            <div className='grid gap-6'>
              <div className='grid gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>E-Mail</Label>
                  <Input
                    id='email'
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
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isLoading}
                  onClick={onSubmit}
                >
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
