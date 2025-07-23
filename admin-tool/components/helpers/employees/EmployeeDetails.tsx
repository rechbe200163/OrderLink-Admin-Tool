'use client';

import type { EmployeeWithOtp } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { resendOtp } from '@/lib/actions/auth.actions';
import { use, useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import CustomeToast from '../toasts/CustomeErrorToast';

export default function EmployeeDetails({
  employee,
  hidePersonalInfo = false,
}: {
  employee: EmployeeWithOtp;
  hidePersonalInfo?: boolean;
}) {
  const isVerified = !!employee.otp?.used;

  const [formState, action, isPending] = useActionState(
    resendOtp.bind(null, employee.employeeId),
    {
      success: false,
      errors: {
        title: [''],
      },
    }
  );

  useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message='OTP resent successfully' />
      ));
    } else if (formState.errors?.title[0]) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={formState.errors?.title?.[0] ?? ''}
        />
      ));
    }
  }, [formState]);

  return (
    <Card className='shadow-md p-6 bg-background'>
      <CardContent className='p-0 space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          Employee Details
        </h3>

        {!hidePersonalInfo && (
          <>
            <p className='text-muted-foreground'>
              Email:{' '}
              <span className='font-medium text-foreground'>
                {employee.email}
              </span>
            </p>
            <p className='text-muted-foreground'>
              First Name:{' '}
              <span className='font-medium text-foreground'>
                {employee.firstName}
              </span>
            </p>
            <p className='text-muted-foreground'>
              Last Name:{' '}
              <span className='font-medium text-foreground'>
                {employee.lastName}
              </span>
            </p>
            <p className='text-muted-foreground'>
              Role:{' '}
              <span className='font-medium text-foreground'>
                {employee.role}
              </span>
            </p>
          </>
        )}

        {employee.otp && (
          <p className='text-muted-foreground'>
            OTP Code:{' '}
            <span className='font-medium text-foreground'>
              {employee.otp.code}
            </span>
          </p>
        )}

        <p className='text-muted-foreground'>
          Verifiziert:{' '}
          <span
            className={`font-medium ${isVerified ? 'text-green-600' : 'text-red-600'}`}
          >
            {isVerified ? 'Ja' : 'Nein'}
          </span>
        </p>

        <form action={action} className='pt-4'>
          <Button type='submit'>OTP erneut senden</Button>
        </form>
      </CardContent>
    </Card>
  );
}
