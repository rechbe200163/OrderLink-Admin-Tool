import React from 'react';
import { OtpForm } from '@/components/session/OtpForm';

const OtpSignInPage = () => {
  return (
    <div className='flex min-h-svh items-center justify-center bg-muted p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-3xl'>
        <OtpForm />
      </div>
    </div>
  );
};

export default OtpSignInPage;
