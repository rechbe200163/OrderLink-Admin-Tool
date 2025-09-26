import React from 'react';
import { OtpForm } from '@/components/session/OtpForm';

const OtpSignInPage = async ({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) => {
  const { tenantSlug } = await params;
  return (
    <div className='flex min-h-svh items-center justify-center bg-muted p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-3xl'>
        <OtpForm tenantSlug={tenantSlug} />
      </div>
    </div>
  );
};

export default OtpSignInPage;
