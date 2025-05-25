import SignInForm from '@/components/forms/auth/SigInForm';
import Link from 'next/link';
import { Suspense } from 'react';

export default function SignIn() {
  return (
    <div className='h-screen w-screen flex justify-center items-center bg-slate-100'>
      <div className='sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12'>
        <h1 className='font-semibold text-2xl'>Login</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <SignInForm />
        </Suspense>
        <p className='text-center'>
          Need to create an account?
          <Link className='text-indigo-500 hover:underline' href='/auth/signup'>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
