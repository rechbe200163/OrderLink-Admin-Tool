'use client';
import { EmployeeWithOtp } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { resendOtp } from '@/lib/actions/auth.actions';

export default function EmployeeDetails({
  employee,
  isLoggedIn,
}: {
  employee: EmployeeWithOtp;
  isLoggedIn: boolean;
}) {
  return (
    <div className='space-y-2'>
      <h2 className='text-3xl font-bold mb-4'>Employee Details</h2>
      <p>Email: {employee.email}</p>
      <p>First Name: {employee.firstName}</p>
      <p>Last Name: {employee.lastName}</p>
      <p>Role: {employee.role}</p>
      {employee.otp && <p>OTP: {employee.otp}</p>}
      <p>Status: {isLoggedIn ? 'Logged in' : 'Logged out'}</p>
      <form action={resendOtp}>
        <Button type='submit'>Resend OTP</Button>
      </form>
    </div>
  );
}
