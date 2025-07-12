'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useActionState, useState } from 'react';
import { logIn } from '@/lib/actions/auth.actions';

const SignInForm = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = searchParams.get('error');
  const [_formState, action, isLoading] = useActionState(logIn, {
    success: false,
    errors: { title: [] as string[] },
  });

  const [fieldType, setFieldType] = useState('password');

  return (
    <>
      {error && (
        <div role='alert' className='alert alert-error'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 shrink-0 stroke-current'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>
            <strong>Error:</strong> {error}
          </span>
        </div>
      )}
      <form action={action} className='space-y-12 w-full sm:w-[400px]'>
        <div className='grid w-full items-center gap-1.5'>
          <Label htmlFor='email'>Email</Label>
          <Input
            className='w-full'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id='email'
            name='email'
            type='email'
          />
        </div>
        <div className='grid w-full items-center gap-1.5'>
          <Label htmlFor='password'>Password</Label>
          <div className='relative'>
            <Input
              className='w-full pr-10'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id='password'
              name='password'
              type={fieldType}
            />
            <button
              type='button'
              tabIndex={-1}
              className='absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700'
              onClick={() =>
                setFieldType((prev) =>
                  prev === 'password' ? 'text' : 'password'
                )
              }
              aria-label={
                fieldType === 'password' ? 'Show password' : 'Hide password'
              }
            >
              {fieldType === 'password' ? (
                // Eye (show)
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                  />
                </svg>
              ) : (
                // Eye Off (hide)
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.383A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.293 5.032M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className='w-full'>
          <Button type='submit' className='w-full ' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={20} className='animate-spin' /> &nbsp; Loging you
                in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default SignInForm;
